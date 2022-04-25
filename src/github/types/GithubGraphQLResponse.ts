import {assertObject, assertProperty, assertString} from "../../types/util";

export const GITHUB_ORGANIZATION_FIELDS = [
    "id",
    "name",
] as const;

export const GITHUB_REPOSITORY_FIELDS = [
    "id",
    "nameWithOwner",
    "sshUrl",
] as const;

export function assertFields(
    scope: string,
    value: unknown,
    stringFields: readonly string[]
): asserts value is GithubRepository {
    assertObject(scope, value);
    for (const field of stringFields) {
        assertProperty(scope, value, field);
        assertString(`${scope}.${field}`, value[field]);
    }
}

export interface GithubOrganization extends Readonly<Record<typeof GITHUB_ORGANIZATION_FIELDS[number], string>> {
}

export function assertGithubOrganization(scope: string, value: unknown): asserts value is GithubRepository {
    assertFields(scope, value, GITHUB_ORGANIZATION_FIELDS);
}

export interface GithubRepository extends Readonly<Record<typeof GITHUB_REPOSITORY_FIELDS[number], string>> {
}

export function assertGithubRepository(scope: string, value: unknown): asserts value is GithubRepository {
    assertFields(scope, value, GITHUB_REPOSITORY_FIELDS);
}

export interface GithubGraphQLError {
    path: string[],
    extensions: {
        code: string,
        typeName: string,
        argumentName: string,
    },
    locations: {
        line: number,
        column: number,
    }[],
    message: string,
}

export interface GithubGraphQLResponse<ObjectType> {
    data?: Record<string,
        Record<string,
            {
                edges: {
                    cursor: string,
                    node: ObjectType,
                }[],
            }>>,
    errors?: GithubGraphQLError[],
}