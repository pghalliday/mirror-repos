import {inject, singleton} from "tsyringe";
import {ListGithubRepositories} from "./list/ListGithubRepositories";
import {ListGithubOrganizations} from "./list/ListGithubOrganizations";
import {ListGithubOrganizationRepositories} from "./list/ListGithubOrganizationRepositories";
import {merge, mergeMap, Observable, reduce} from "rxjs";
import {GITHUB_INDEX} from "./symbols";
import {GithubIndex} from "./types/GithubIndex";
import {Record} from "./types/Record";
import {GithubRepository} from "./types/GithubGraphQLResponse";
import {isEqual, without} from "lodash";

@singleton()
export class Github {
    constructor(
        @inject(ListGithubRepositories) private readonly listGithubRepositories: ListGithubRepositories,
        @inject(ListGithubOrganizations) private readonly listGithubOrganizations: ListGithubOrganizations,
        @inject(ListGithubOrganizationRepositories) private readonly listGithubOrganizationRepositories: ListGithubOrganizationRepositories,
        @inject(GITHUB_INDEX) private readonly githubIndex: GithubIndex,
    ) {
    }

    private getUpdated(updated: readonly GithubRepository[], githubRepository: GithubRepository): readonly GithubRepository[] {
        const existing = this.githubIndex[githubRepository.id];
        if (existing === undefined || !isEqual(existing, githubRepository)) {
            return [...updated, githubRepository];
        }
        return updated;
    }

    private record(record: Record, githubRepository: GithubRepository): Record {
        return {
            remainingIds: without(record.remainingIds, githubRepository.id),
            updated: this.getUpdated(record.updated, githubRepository),
        }
    }

    public sync(): Observable<Record> {
        return merge(
            this.listGithubRepositories.query(),
            this.listGithubOrganizations.query().pipe(
                mergeMap(organization => this.listGithubOrganizationRepositories.query(organization.name)),
            ),
        ).pipe(
            reduce(this.record.bind(this), {
                remainingIds: Object.keys(this.githubIndex),
                updated: [],
            }),
        );
    }
}
