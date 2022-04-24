import {inject, injectable} from "tsyringe";
import {Observable, from, Subscriber} from "rxjs";
import {ArgObject, FieldObject, QueryOperation, QueryType} from "gotql/dist/types/QueryType";
import {UserOptions} from "gotql/dist/types/UserOptions";
import {RepositoriesQueryResponse, Repository} from "./Types";
import { query } from "gotql";
import {CONTAINER_SYMBOLS} from "./ContainerSymbols";

const MAX_FIRST: number = 100;

const NULL_ARG: ArgObject = {
    value: "null",
    escape: false,
}

const NODE_FIELD: FieldObject = {
    node: {
        fields: [
            "id",
            "sshUrl",
            "name",
        ],
    },
};

const EDGES_FIELD: FieldObject = {
    edges: {
        fields: [
            "cursor",
            NODE_FIELD,
        ],
    },
};

function repositoriesField(cursor: string | ArgObject): FieldObject {
    return {
        repositories: {
            args: {
                first: {
                    value: MAX_FIRST,
                    escape: false,
                },
                after: cursor,
            },
            fields: [
                EDGES_FIELD,
            ],
        },
    };
}

function viewerOperation(cursor: string | ArgObject): QueryOperation {
    return {
        name: "viewer",
        fields: [
            repositoriesField(cursor),
        ],
    };
}

function getRepositoriesQuery(cursor: string | ArgObject): QueryType {
    return {
        operation: viewerOperation(cursor),
    };
}

@injectable()
export class ListRepositories {
    constructor(
        @inject(CONTAINER_SYMBOLS.githubEndpoint) private readonly endpoint: string,
        @inject(CONTAINER_SYMBOLS.githubAccessToken) private readonly accessToken: string,
    ) {}

    private getOptions(): UserOptions {
        return {
            headers: {
                Authorization: "Bearer " + this.accessToken
            },
            useHttp2: false,
        };
    }

    private async notifyRepositories(subscriber: Subscriber<Repository>): Promise<void> {
        const options = this.getOptions();
        let hasMore = true;
        let cursor: string | ArgObject = NULL_ARG;
        while (hasMore) {
            hasMore = false;
            const response: RepositoriesQueryResponse = await query(this.endpoint, getRepositoriesQuery(cursor), options);
            if (response.errors !== undefined) {
                subscriber.error(response.errors);
            } else if (response.data !== undefined) {
                const repositoryEdges = response.data.viewer.repositories.edges;
                const length = repositoryEdges.length;
                if (length > 0) {
                    hasMore = true;
                    cursor = repositoryEdges[length - 1].cursor;
                    for (const repositoryEdge of repositoryEdges) {
                        subscriber.next(repositoryEdge.node);
                    }
                } else {
                    subscriber.complete();
                }
            } else {
                subscriber.error("Neither data not errors returned from GraphQL query for repositories");
            }
        }
    }

    public query(): Observable<Repository> {
        return new Observable<Repository>(subscriber => {
            this.notifyRepositories(subscriber)
                .catch(subscriber.error.bind(subscriber));
        });
    }
}