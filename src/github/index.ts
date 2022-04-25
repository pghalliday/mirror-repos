import {DependencyContainer} from "tsyringe";
import {ListGithubRepositories} from "./ListGithubRepositories";
import {ListGithubOrganizations} from "./ListGithubOrganizations";
import {ListGithubOrganizationRepositories} from "./ListGithubOrganizationRepositories";
import {merge, mergeMap} from "rxjs";
import {configure} from "./configure";

export function sync(container: DependencyContainer) {
    configure(container);

    const listRepositories = container.resolve(ListGithubRepositories);
    const listOrganizations = container.resolve(ListGithubOrganizations);
    const listOrganizationRepositories = container.resolve(ListGithubOrganizationRepositories);

    merge(
        listRepositories.query(),
        listOrganizations.query().pipe(
            mergeMap(organization => listOrganizationRepositories.query(organization.name))
        ),
    ).subscribe({
        next: console.log,
        error: console.error,
        complete: () => console.log("complete"),
    });
}
