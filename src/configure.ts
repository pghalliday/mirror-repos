import {DependencyContainer, instanceCachingFactory} from "tsyringe";
import {Config} from "./types/Config";
import {ConfigFile} from "./files/ConfigFile";
import {configure as githubConfigure} from "./github/configure";
import {CONFIG, CONFIG_FILE_PATH} from "./tokens";

export function configure(container: DependencyContainer, configFilePath: string) {
    container.register(CONFIG_FILE_PATH, {useValue: configFilePath});
    container.register(CONFIG, {
        useFactory: instanceCachingFactory<Config>(c => c.resolve(ConfigFile).read())
    });
    githubConfigure(container);
}