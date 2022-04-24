export type Organization = {
    readonly id: string,
    readonly name: string,
};

export type Repository = {
    readonly id: string,
    readonly name: string,
    readonly sshUrl: string,
};

export type OrganizationEdge = {
    cursor: string,
    node: Organization,
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

export type OrganizationsQueryResponse = {
    data?: {
        viewer: {
            organizations: {
                edges: OrganizationEdge[],
            },
        },
    },
    errors?: GraphQLError[],
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