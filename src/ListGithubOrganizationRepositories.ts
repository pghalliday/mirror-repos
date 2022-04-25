import {inject, singleton} from "tsyringe";
import {Observable} from "rxjs";
import {GITHUB_REPOSITORY_FIELDS, GithubRepository} from "./types/GithubGraphQLResponse";
import {GithubList} from "./GithubList";
import {GithubListQuery} from "./GithubListQuery";

@singleton()
export class ListGithubOrganizationRepositories {
    constructor(
        @inject(GithubList) private readonly githubList: GithubList,
    ) {
    }

    public query(organization: string): Observable<GithubRepository> {
        return this.githubList.query(new GithubListQuery(
            "organization",
            {login: organization},
            "repositories",
            GITHUB_REPOSITORY_FIELDS.slice(),
        ));
    }
}
