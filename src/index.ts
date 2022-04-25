import "reflect-metadata";
import {container} from "tsyringe";
import {CONTAINER_SYMBOLS} from "./types/ContainerSymbols";
import {ListGithubRepositories} from "./ListGithubRepositories";
import {ListGithubOrganizations} from "./ListGithubOrganizations";
import {ListGithubOrganizationRepositories} from "./ListGithubOrganizationRepositories";
import {merge, mergeMap} from "rxjs";
import {ConfigLoader} from "./ConfigLoader";

const CONFIG_FILE = process.argv[2] || "config.json";
const ENDPOINT = "https://api.github.com/graphql";

container.register(CONTAINER_SYMBOLS.githubEndpoint, {useValue: ENDPOINT});
container.register(CONTAINER_SYMBOLS.configFile, {useValue: CONFIG_FILE});

const configLoader = container.resolve(ConfigLoader);

container.register(CONTAINER_SYMBOLS.config, {useValue: configLoader.load()});

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
