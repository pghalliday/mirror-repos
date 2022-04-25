import {DependencyContainer, instanceCachingFactory} from "tsyringe";
import {Config} from "../types/Config";
import {GithubConfig} from "./types/GithubConfig";
import {GITHUB_CONFIG, GITHUB_REPOSITORY_DIRECTORIES} from "./symbols";
import {CONFIG} from "../symbols";
import {GithubRepositoryDirectories} from "./files/GithubRepositoryDirectories";

export function configure(container: DependencyContainer) {
    container.register(GITHUB_CONFIG, {
        useFactory: instanceCachingFactory<GithubConfig>(
            c => c.resolve<Config>(CONFIG).github,
        )
    });
    container.register(GITHUB_REPOSITORY_DIRECTORIES, {
        useFactory: instanceCachingFactory<readonly string[]>(
            c => c.resolve(GithubRepositoryDirectories).read(),
        )
    });
}