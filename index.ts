import "reflect-metadata";
import {container} from "tsyringe";
import SECRETS from "./secrets.json";
import {ListRepositories} from "./ListRepositories";
import {CONTAINER_SYMBOLS} from "./ContainerSymbols";
import {ListOrganizations} from "./ListOrganizations";

const ENDPOINT: string = "https://api.github.com/graphql";
const ACCESS_TOKEN: string = SECRETS.github.personalAccessToken;

container.register(CONTAINER_SYMBOLS.githubEndpoint, {useValue: ENDPOINT});
container.register(CONTAINER_SYMBOLS.githubAccessToken, {useValue: ACCESS_TOKEN});
const listRepositories = container.resolve(ListRepositories);
const listOrganizations = container.resolve(ListOrganizations);
const repositoryObservable = listRepositories.query();
repositoryObservable.subscribe({
    next: console.log,
    error: console.error,
    complete: () => console.log("repositories complete"),
});
const organizationObservable = listOrganizations.query();
organizationObservable.subscribe({
    next: console.log,
    error: console.error,
    complete: () => console.log("organizations complete"),
});
