import {assertObject, assertProperty, assertString} from "./util";
import {assertGithubConfig, GithubConfig} from "../github/types/GithubConfig";

export interface Config extends Readonly<{
    outputDirectory: string,
    github: GithubConfig,
}> {
}

export function assertConfig(scope: string, value: unknown): asserts value is Config {
    assertObject(scope, value);
    assertProperty(scope, value, "outputDirectory");
    assertString(`${scope}.outputDirectory`, value.outputDirectory);
    assertProperty(scope, value, "github");
    assertGithubConfig(`${scope}.github`, value.github);
}