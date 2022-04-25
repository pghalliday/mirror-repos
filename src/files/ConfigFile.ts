import {inject, singleton} from "tsyringe";
import {assertConfig, Config} from "../types/Config";
import {readFileSync} from "fs";
import {CONFIG_FILE_PATH} from "../tokens";

@singleton()
export class ConfigFile {
    constructor(
        @inject(CONFIG_FILE_PATH) private readonly configFilePath: string,
    ) {
    }

    public read(): Config {
        const config = JSON.parse(readFileSync(this.configFilePath).toString())
        assertConfig("config", config);
        return config;
    }
}