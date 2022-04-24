export const ORGANIZATION_FIELDS = [
    "id",
    "name",
] as const;

export const REPOSITORY_FIELDS = [
    "id",
    "name",
    "sshUrl",
] as const;

export interface Organization extends Readonly<Record<typeof ORGANIZATION_FIELDS[number], string>> {}
export interface Repository extends Readonly<Record<typeof REPOSITORY_FIELDS[number], string>> {}

export type GraphQLError = {
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

export type GraphQLEdge<ObjectType> = {
    cursor: string,
    node: ObjectType,
};

export type GraphQLEdges<ObjectType> = {
    edges: GraphQLEdge<ObjectType>[],
};

export type GraphQLResponse<ObjectType> = {
    data?: Record<string, Record<string, GraphQLEdges<ObjectType>>>,
    errors?: GraphQLError[],
};