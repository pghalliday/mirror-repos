import "reflect-metadata";
import {container} from "tsyringe";
import SECRETS from "./secrets.json";
import {ListRepositories} from "./ListRepositories";
import {CONTAINER_SYMBOLS} from "./ContainerSymbols";
import {ListOrganizations} from "./ListOrganizations";
import {ListOrganizationRepositories} from "./ListOrganizationRepositories";
import {merge, mergeMap} from "rxjs";

const ENDPOINT: string = "https://api.github.com/graphql";
const ACCESS_TOKEN: string = SECRETS.github.personalAccessToken;

container.register(CONTAINER_SYMBOLS.githubEndpoint, {useValue: ENDPOINT});
container.register(CONTAINER_SYMBOLS.githubAccessToken, {useValue: ACCESS_TOKEN});
const listRepositories = container.resolve(ListRepositories);
const listOrganizations = container.resolve(ListOrganizations);
const listOrganizationRepositories = container.resolve(ListOrganizationRepositories);
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
