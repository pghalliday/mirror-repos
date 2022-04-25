import {DependencyContainer, instanceCachingFactory} from "tsyringe";
import {Config} from "../types/Config";
import {GithubIndex} from "./types/GithubIndex";
import {GithubIndexFile} from "./files/GithubIndexFile";
import {GithubConfig} from "./types/GithubConfig";
import {GITHUB_CONFIG, GITHUB_INDEX} from "./symbols";
import {CONFIG} from "../symbols";

export function configure(container: DependencyContainer) {
    container.register(GITHUB_CONFIG, {
        useFactory: instanceCachingFactory<GithubConfig>(c => c.resolve<Config>(CONFIG).github)
    });
    container.register(GITHUB_INDEX, {
        useFactory: instanceCachingFactory<GithubIndex>(c => c.resolve(GithubIndexFile).read())
    });
}