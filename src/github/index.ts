import {inject, singleton} from "tsyringe";
import {ListGithubRepositories} from "./list/ListGithubRepositories";
import {ListGithubOrganizations} from "./list/ListGithubOrganizations";
import {ListGithubOrganizationRepositories} from "./list/ListGithubOrganizationRepositories";
import {merge, mergeMap} from "rxjs";
import {GITHUB_INDEX} from "./tokens";
import {GithubIndex} from "./types/GithubIndex";

@singleton()
export class Github {
    constructor(
        @inject(ListGithubRepositories) private readonly listGithubRepositories: ListGithubRepositories,
        @inject(ListGithubOrganizations) private readonly listGithubOrganizations: ListGithubOrganizations,
        @inject(ListGithubOrganizationRepositories) private readonly listGithubOrganizationRepositories: ListGithubOrganizationRepositories,
        @inject(GITHUB_INDEX) private readonly githubIndex: GithubIndex,
    ) {
    }

    sync() {
        merge(
            this.listGithubRepositories.query(),
            this.listGithubOrganizations.query().pipe(
                mergeMap(organization => this.listGithubOrganizationRepositories.query(organization.name))
            ),
        ).subscribe({
            next: console.log,
            error: console.error,
            complete: () => console.log("complete"),
        });
    }
}
