import {assertObject, assertProperty, assertString} from "../../types/util";

export interface GithubConfig extends Readonly<{
    endpoint: string,
    personalAccessToken: string,
}> {
}

export function assertGithubConfig(scope: string, value: unknown): asserts value is GithubConfig {
    assertObject(scope, value);
    assertProperty(scope, value, "personalAccessToken");
    assertString(`${scope}.personalAccessToken`, value.personalAccessToken);
    assertProperty(scope, value, "endpoint");
    assertString(`${scope}.endpoint`, value.endpoint);
}