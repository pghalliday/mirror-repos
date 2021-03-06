import {assertObject, assertProperty, assertString} from "../../types/util";

export interface GithubConfig extends Readonly<{
    graphQLEndpoint: string,
    sshEndpoint: string,
    personalAccessToken: string,
}> {
}

export function assertGithubConfig(scope: string, value: unknown): asserts value is GithubConfig {
    assertObject(scope, value);
    assertProperty(scope, value, "personalAccessToken");
    assertString(`${scope}.personalAccessToken`, value.personalAccessToken);
    assertProperty(scope, value, "graphQLEndpoint");
    assertString(`${scope}.graphQLEndpoint`, value.graphQLEndpoint);
    assertProperty(scope, value, "sshEndpoint");
    assertString(`${scope}.sshEndpoint`, value.sshEndpoint);
}