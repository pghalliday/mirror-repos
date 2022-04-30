import {assertBoolean, assertObject, assertProperty, assertString} from "./util";
import {assertGithubConfig, GithubConfig} from "../github/types/GithubConfig";

export interface Config extends Readonly<{
    outputDirectory: string,
    logFile: string,
    logLevel: string,
    gitBinary: string,
    strictHostKeyChecking: boolean,
    github: GithubConfig,
}> {
}

export function assertConfig(scope: string, value: unknown): asserts value is Config {
    assertObject(scope, value);
    assertProperty(scope, value, "outputDirectory");
    assertString(`${scope}.outputDirectory`, value.outputDirectory);
    assertProperty(scope, value, "logFile");
    assertString(`${scope}.logFile`, value.logFile);
    assertProperty(scope, value, "logLevel");
    assertString(`${scope}.logLevel`, value.logLevel);
    assertProperty(scope, value, "gitBinary");
    assertString(`${scope}.gitBinary`, value.gitBinary);
    assertProperty(scope, value, "strictHostKeyChecking");
    assertBoolean(`${scope}.strictHostKeyChecking`, value.strictHostKeyChecking);
    assertProperty(scope, value, "github");
    assertGithubConfig(`${scope}.github`, value.github);
}