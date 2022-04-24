import {inject, injectable} from "tsyringe";
import {Observable, Subscriber} from "rxjs";
import {ArgObject, FieldObject, QueryOperation, QueryType} from "gotql/dist/types/QueryType";
import {UserOptions} from "gotql/dist/types/UserOptions";
import {Organization, OrganizationsQueryResponse} from "./Types";
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

function organizationsField(cursor: string | ArgObject): FieldObject {
    return {
        organizations: {
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
            organizationsField(cursor),
        ],
    };
}

function getOrganizationsQuery(cursor: string | ArgObject): QueryType {
    return {
        operation: viewerOperation(cursor),
    };
}

@injectable()
export class ListOrganizations {
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

    private async notifyOrganizations(subscriber: Subscriber<Organization>): Promise<void> {
        const options = this.getOptions();
        let hasMore = true;
        let cursor: string | ArgObject = NULL_ARG;
        while (hasMore) {
            hasMore = false;
            const response: OrganizationsQueryResponse = await query(this.endpoint, getOrganizationsQuery(cursor), options);
            if (response.errors !== undefined) {
                subscriber.error(response.errors);
            } else if (response.data !== undefined) {
                const organizationEdges = response.data.viewer.organizations.edges;
                const length = organizationEdges.length;
                if (length > 0) {
                    hasMore = true;
                    cursor = organizationEdges[length - 1].cursor;
                    for (const organizationEdge of organizationEdges) {
                        subscriber.next(organizationEdge.node);
                    }
                } else {
                    subscriber.complete();
                }
            } else {
                subscriber.error("Neither data not errors returned from GraphQL query for organizations");
            }
        }
    }

    public query(): Observable<Organization> {
        return new Observable<Organization>(subscriber => {
            this.notifyOrganizations(subscriber)
                .catch(subscriber.error.bind(subscriber));
        });
    }
}