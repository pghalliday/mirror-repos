import {inject, singleton} from "tsyringe";
import {Observable} from "rxjs";
import {GITHUB_ORGANIZATION_FIELDS, GithubOrganization} from "../types/GithubGraphQLResponse";
import {GithubList} from "./GithubList";
import {GithubListQuery} from "./GithubListQuery";

@singleton()
export class ListGithubOrganizations {
    constructor(
        @inject(GithubList) private readonly githubList: GithubList
    ) {
    }

    public query(): Observable<GithubOrganization> {
        return this.githubList.query(new GithubListQuery(
            "viewer",
            {},
            "organizations",
            GITHUB_ORGANIZATION_FIELDS.slice(),
        ));
    }
}
