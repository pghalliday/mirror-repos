import {inject, injectable, singleton} from "tsyringe";
import {CONTAINER_SYMBOLS} from "./types/ContainerSymbols";
import {assertConfig, Config} from "./types/Config";
import {readFileSync} from "fs";

@singleton()
export class ConfigLoader {
    constructor(
        @inject(CONTAINER_SYMBOLS.configFile) private readonly configFile: string,
    ) {
    }

    public load(): Config {
        const config = JSON.parse(readFileSync(this.configFile).toString())
        assertConfig("config", config);
        return config;
    }
}