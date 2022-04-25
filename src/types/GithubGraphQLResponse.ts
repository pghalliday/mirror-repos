export const GITHUB_ORGANIZATION_FIELDS = [
    "id",
    "name",
] as const;

export const GITHUB_REPOSITORY_FIELDS = [
    "id",
    "nameWithOwner",
    "sshUrl",
] as const;

export interface GithubOrganization extends Readonly<Record<typeof GITHUB_ORGANIZATION_FIELDS[number], string>> {
}

export interface GithubRepository extends Readonly<Record<typeof GITHUB_REPOSITORY_FIELDS[number], string>> {
}

export type GithubGraphQLError = {
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
};

export type GithubGraphQLEdge<ObjectType> = {
    cursor: string,
    node: ObjectType,
};

export type GithubGraphQLEdges<ObjectType> = {
    edges: GithubGraphQLEdge<ObjectType>[],
};

export type GithubGraphQLResponse<ObjectType> = {
    data?: Record<string, Record<string, GithubGraphQLEdges<ObjectType>>>,
    errors?: GithubGraphQLError[],
};