import {inject, singleton} from "tsyringe";
import {CONFIG} from "../../symbols";
import {Config} from "../../types/Config";
import {relative, resolve} from "path";
import {lstatSync, readdirSync} from "fs";
import {GITHUB_DIRECTORY} from "../constants";
import {sync as mkdirpSync} from "mkdirp";

function getSubDirectories(path: string): string[] {
    return readdirSync(path)
        .filter(file => ![".", ".."].includes(file))
        .map(file => resolve(path, file))
        .filter(subPath => lstatSync(subPath).isDirectory())
}

@singleton()
export class GithubRepositoryDirectories {
    private readonly rootPath: string;

    constructor(
        @inject(CONFIG) readonly config: Config,
    ) {
        this.rootPath = resolve(config.outputDirectory, GITHUB_DIRECTORY);
    }

    public read(): readonly string[] {
        mkdirpSync(this.rootPath);
        return getSubDirectories(this.rootPath)
            .flatMap(path => getSubDirectories(path))
            .map(path => relative(this.rootPath, path));
    }
}