import {Observable, Subscriber} from "rxjs";
import {ArgObject, FieldObject, QueryOperation, QueryType} from "gotql/dist/types/QueryType";
import {UserOptions} from "gotql/dist/types/UserOptions";
import {GraphQLResponse} from "./Types";
import { query } from "gotql";

const MAX_FIRST: number = 100;

const NULL_ARG: ArgObject = {
    value: "null",
    escape: false,
}

function nodeField(objectFields: readonly string[]): FieldObject {
    return {
        node: {
            fields: objectFields.slice(),
        },
    };
}

function edgesField(objectFields: readonly string[]): FieldObject {
    return {
        edges: {
            fields: [
                "cursor",
                nodeField(objectFields),
            ],
        },
    };
}

function requestedField(requested: string, objectFields: readonly string[], cursor: string | ArgObject): FieldObject {
    return {
        [requested]: {
            args: {
                first: {
                    value: MAX_FIRST,
                    escape: false,
                },
                after: cursor,
            },
            fields: [
                edgesField(objectFields),
            ],
        },
    };
}

function viewerOperation(requested: string, objectFields: readonly string[], cursor: string | ArgObject): QueryOperation {
    return {
        name: "viewer",
        fields: [
            requestedField(requested, objectFields, cursor),
        ],
    };
}

function getQuery(requested: string, objectFields: readonly string[], cursor: string | ArgObject): QueryType {
    return {
        operation: viewerOperation(requested, objectFields, cursor),
    };
}

export class List<ObjectType> {
    constructor(
        private readonly endpoint: string,
        private readonly accessToken: string,
    ) {}

    private getOptions(): UserOptions {
        return {
            headers: {
                Authorization: "Bearer " + this.accessToken
            },
            useHttp2: false,
        };
    }

    private async notify(requested: string, objectFields: readonly string[], subscriber: Subscriber<ObjectType>): Promise<void> {
        const options = this.getOptions();
        let hasMore = true;
        let cursor: string | ArgObject = NULL_ARG;
        while (hasMore) {
            hasMore = false;
            const response: GraphQLResponse<ObjectType> = await query(this.endpoint, getQuery(requested, objectFields, cursor), options);
            if (response.errors !== undefined) {
                subscriber.error(response.errors);
            } else if (response.data !== undefined) {
                const edges = response.data.viewer[requested].edges;
                const length = edges.length;
                if (length > 0) {
                    hasMore = true;
                    cursor = edges[length - 1].cursor;
                    for (const edge of edges) {
                        subscriber.next(edge.node);
                    }
                } else {
                    subscriber.complete();
                }
            } else {
                subscriber.error(`Neither data not errors returned from GraphQL query for ${requested}`);
            }
        }
    }

    public query(requested: string, objectFields: readonly string[]): Observable<ObjectType> {
        return new Observable<ObjectType>(subscriber => {
            this.notify(requested, objectFields, subscriber)
                .catch(subscriber.error.bind(subscriber));
        });
    }
}