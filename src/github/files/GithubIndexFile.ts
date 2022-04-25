import {inject, singleton} from "tsyringe";
import {Config} from "../../types/Config";
import {existsSync, readFileSync, writeFileSync} from "fs";
import {assertGithubIndex, GithubIndex} from "../types/GithubIndex";
import {join} from "path";
import {INDEX_JSON} from "../../constants";
import {GITHUB_DIRECTORY} from "../constants";
import {CONFIG} from "../../tokens";

@singleton()
export class GithubIndexFile {
    private readonly path: string;

    constructor(
        @inject(CONFIG) readonly config: Config,
    ) {
        this.path = join(this.config.outputDirectory, GITHUB_DIRECTORY, INDEX_JSON);
    }

    public read(): GithubIndex {
        if (existsSync(this.path)) {
            const githubIndex = JSON.parse(readFileSync(this.path).toString())
            assertGithubIndex("githubIndex", githubIndex);
            return githubIndex;
        }
        return {};
    }

    public write(githubIndex: GithubIndex): void {
        writeFileSync(this.path, JSON.stringify(githubIndex));
    }
}
