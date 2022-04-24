export type Repository = {
    readonly id: string,
    readonly name: string,
    readonly sshUrl: string,
};

export type RepositoryEdge = {
    cursor: string,
    node: Repository,
};

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

export type RepositoriesQueryResponse = {
    data?: {
        viewer: {
            repositories: {
                edges: RepositoryEdge[],
            },
        },
    },
    errors?: GraphQLError[],
};