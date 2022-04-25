import {inject, singleton} from "tsyringe";
import {ListGithubRepositories} from "./list/ListGithubRepositories";
import {ListGithubOrganizations} from "./list/ListGithubOrganizations";
import {ListGithubOrganizationRepositories} from "./list/ListGithubOrganizationRepositories";
import {map, merge, mergeMap, Observable, reduce, tap} from "rxjs";
import {GITHUB_CONFIG, GITHUB_REPOSITORY_DIRECTORIES} from "./symbols";
import {without} from "lodash";
import {resolve} from "path";
import {sync as rimrafSync} from "rimraf";
import {CONFIG} from "../symbols";
import {Config} from "../types/Config";
import {GITHUB_DIRECTORY} from "./constants";
import simpleGit, {SimpleGit, SimpleGitOptions} from "simple-git";
import {GithubConfig} from "./types/GithubConfig";
import {LogMessage} from "../types/LogMessage";

function getLogMessageMethod(repository: string, task: string): (level: string, message: string) => LogMessage {
    return (level, message) => ({
        level,
        message,
        meta: {
            source: "GitHub",
            repository,
            task,
        },
    });
}

@singleton()
export class Github {
    constructor(
        @inject(ListGithubRepositories) private readonly listGithubRepositories: ListGithubRepositories,
        @inject(ListGithubOrganizations) private readonly listGithubOrganizations: ListGithubOrganizations,
        @inject(ListGithubOrganizationRepositories) private readonly listGithubOrganizationRepositories: ListGithubOrganizationRepositories,
        @inject(GITHUB_REPOSITORY_DIRECTORIES) private readonly githubRepositoryDirectories: readonly string[],
        @inject(GITHUB_CONFIG) private readonly githubConfig: GithubConfig,
        @inject(CONFIG) private readonly config: Config,
    ) {
    }

    private getSshUrl(repositoryDirectory: string): string {
        return `${this.githubConfig.sshEndpoint}:${repositoryDirectory}.git`;
    }

    private getRepositoryPath(repositoryDirectory: string): string {
        return resolve(
            this.config.outputDirectory,
            GITHUB_DIRECTORY,
            repositoryDirectory,
        );
    }

    private updateRepositoryDirectory(repositoryDirectory: string): Observable<LogMessage> {
        const getLogMessage = getLogMessageMethod(repositoryDirectory, "UPDATE");
        const path = this.getRepositoryPath(repositoryDirectory);
        const options: Partial<SimpleGitOptions> = {
            baseDir: path,
            binary: 'git',
            maxConcurrentProcesses: 6,
        };
        const git: SimpleGit = simpleGit(options);
        return new Observable<LogMessage>(subscriber => {
            subscriber.next(getLogMessage("info", "start"));
            git.remote(["--verbose", "update", "--prune"])
                .then(response => {
                    if (response !== undefined) {
                        response.split("\n")
                            .map(line => line.trim())
                            .filter(line => line.length > 0)
                            .forEach(line => subscriber.next(getLogMessage("info", line)));
                    }
                    subscriber.next(getLogMessage("info", "end"))
                    subscriber.complete();
                })
                .catch(error => subscriber.error(error));
        });
    }

    private mirrorRepositoryDirectory(repositoryDirectory: string): Observable<LogMessage> {
        const getLogMessage = getLogMessageMethod(repositoryDirectory, "MIRROR");
        const path = this.getRepositoryPath(repositoryDirectory);
        const options: Partial<SimpleGitOptions> = {
            baseDir: process.cwd(),
            binary: 'git',
            maxConcurrentProcesses: 6,
        };
        const git: SimpleGit = simpleGit(options);
        return new Observable<LogMessage>(subscriber => {
            subscriber.next(getLogMessage("info", "start"));
            git.mirror(this.getSshUrl(repositoryDirectory), path)
                .then(response => {
                    response.split("\n")
                        .map(line => line.trim())
                        .filter(line => line.length > 0)
                        .forEach(line => subscriber.next(getLogMessage("info", line)));
                    subscriber.next(getLogMessage("info", "end"))
                    subscriber.complete();
                })
                .catch(error => subscriber.error(error));
        });
    }

    private syncRepositoryDirectory(repositoryDirectory: string): Observable<LogMessage> {
        if (this.githubRepositoryDirectories.includes(repositoryDirectory)) {
            return this.updateRepositoryDirectory(repositoryDirectory);
        } else {
            return this.mirrorRepositoryDirectory(repositoryDirectory);
        }
    }

    private syncRepositories(repositories: Observable<string>): Observable<LogMessage> {
        return repositories.pipe(
            mergeMap(this.syncRepositoryDirectory.bind(this)),
        );
    }

    private removeRepositoryDirectories(repositoryDirectories: readonly string[]): Observable<LogMessage> {
        return new Observable<LogMessage>(subscriber => {
            try {
                for (let repositoryDirectory of repositoryDirectories) {
                    const getLogMessage = getLogMessageMethod(repositoryDirectory, "DELETE");
                    subscriber.next(getLogMessage("info", "start"));
                    rimrafSync(this.getRepositoryPath(repositoryDirectory));
                    subscriber.next(getLogMessage("info", "end"));
                }
                subscriber.complete()
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    private removeUnmatchedRepositoryDirectories(repositories: Observable<string>): Observable<LogMessage> {
        return repositories.pipe(
            reduce(
                (remainingRepositoryDirectories, repositoryDirectory) => without(
                    remainingRepositoryDirectories,
                    repositoryDirectory,
                ),
                this.githubRepositoryDirectories,
            ),
            mergeMap(this.removeRepositoryDirectories.bind(this)),
        );
    }

    private getRepositories(): Observable<string> {
        return merge(
            this.listGithubRepositories.query(),
            this.listGithubOrganizations.query().pipe(
                mergeMap(organization => this
                    .listGithubOrganizationRepositories
                    .query(organization.name)),
            ),
        ).pipe(
            map(githubRepository => githubRepository.nameWithOwner),
        );
    }

    public sync(): Observable<LogMessage> {
        const repositories = this.getRepositories();
        return merge(
            this.syncRepositories(repositories),
            this.removeUnmatchedRepositoryDirectories(repositories),
        )
    }
}
