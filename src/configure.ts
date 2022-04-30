import {DependencyContainer, instanceCachingFactory} from "tsyringe";
import {Config} from "./types/Config";
import {ConfigFile} from "./files/ConfigFile";
import {configure as githubConfigure} from "./github/configure";
import {CONFIG, CONFIG_FILE_PATH, LOGGER} from "./symbols";
import winston from "winston";
import {Logger} from "./Logger";

export function configure(container: DependencyContainer, configFilePath: string) {
    container.register(CONFIG_FILE_PATH, {useValue: configFilePath});
    container.register(CONFIG, {
        useFactory: instanceCachingFactory<Config>(c => c.resolve(ConfigFile).read())
    });
    container.register(LOGGER, {
        useFactory: instanceCachingFactory<winston.Logger>(c => c.resolve(Logger).get())
    });
    githubConfigure(container);
}