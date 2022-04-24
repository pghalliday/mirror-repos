import "reflect-metadata";
import {container} from "tsyringe";
import SECRETS from "./secrets.json";
import {ListRepositories} from "./ListRepositories";
import {CONTAINER_SYMBOLS} from "./ContainerSymbols";

const ENDPOINT: string = "https://api.github.com/graphql";
const ACCESS_TOKEN: string = SECRETS.github.personalAccessToken;

container.register(CONTAINER_SYMBOLS.githubEndpoint, {useValue: ENDPOINT});
container.register(CONTAINER_SYMBOLS.githubAccessToken, {useValue: ACCESS_TOKEN});
const listRepositories = container.resolve(ListRepositories);
const repositoryObservable = listRepositories.query();
repositoryObservable.subscribe({
    next: console.log,
    error: console.error,
    complete: () => console.log("complete"),
})
