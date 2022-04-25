import {assertObject, assertProperty, assertString} from "./util";

export type GithubConfig = Readonly<{
    endpoint: string,
    personalAccessToken: string,
}>;

export function assertGithubConfig(scope: string, value: unknown): asserts value is GithubConfig {
    assertObject(scope, value);
    assertProperty(scope, value, "personalAccessToken");
    assertString(`${scope}.personalAccessToken`, value.personalAccessToken);
    assertProperty(scope, value, "endpoint");
    assertString(`${scope}.endpoint`, value.endpoint);
}

export type Config = Readonly<{
    github: GithubConfig,
}>;

export function assertConfig(scope: string, value: unknown): asserts value is Config {
    assertObject(scope, value);
    assertProperty(scope, value, "github");
    assertGithubConfig(`${scope}.github`, value.github);
}