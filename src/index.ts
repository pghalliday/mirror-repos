import "reflect-metadata";
import {container, instanceCachingFactory} from "tsyringe";
import {CONTAINER_SYMBOLS} from "./types/ContainerSymbols";
import {ListGithubRepositories} from "./ListGithubRepositories";
import {ListGithubOrganizations} from "./ListGithubOrganizations";
import {ListGithubOrganizationRepositories} from "./ListGithubOrganizationRepositories";
import {merge, mergeMap} from "rxjs";
import {ConfigLoader} from "./ConfigLoader";
import {Config, GithubConfig} from "./types/Config";

const CONFIG_FILE = process.argv[2] || "config.json";

container.register(CONTAINER_SYMBOLS.configFile, {useValue: CONFIG_FILE});
container.register(CONTAINER_SYMBOLS.config, {
    useFactory: instanceCachingFactory<Config>(c => c.resolve(ConfigLoader).load())
});
container.register(CONTAINER_SYMBOLS.githubConfig, {
    useFactory: instanceCachingFactory<GithubConfig>(c => c.resolve<Config>(CONTAINER_SYMBOLS.config).github)
});

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
