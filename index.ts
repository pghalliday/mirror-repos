import {query} from "gotql";
import {FieldObject, QueryOperation, QueryType} from "gotql/dist/types/QueryType";
import {UserOptions} from "gotql/dist/types/UserOptions";
import SECRETS from "./secrets.json";

const ENDPOINT: string = "https://api.github.com/graphql";
const ACCESS_TOKEN: string = SECRETS.github.personalAccessToken;

const MAX_FIRST: number = 100;

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

const REPOSITORIES_FIELD: FieldObject = {
    repositories: {
        args: {
            first: {
                value: MAX_FIRST,
                escape: false,
            },
        },
        fields: [
            EDGES_FIELD,
        ],
    },
};

const VIEWER_OPERATION: QueryOperation = {
    name: "viewer",
    fields: [
        REPOSITORIES_FIELD,
    ],
}

const REPOSITORIES_QUERY: QueryType = {
    operation: VIEWER_OPERATION,
};

const OPTIONS: UserOptions = {
    headers: {
        Authorization: "Bearer " + ACCESS_TOKEN
    },
    useHttp2: false,
};

function printRepositories(response: any) {
    if (response.data) {
        var edges = response
            .data
            .viewer
            .repositories
            .edges;
        console.log(edges);
        console.log(edges.length);
    } else {
        console.log(response);
    }
}

query(ENDPOINT, REPOSITORIES_QUERY, OPTIONS)
    .then(printRepositories)
    .catch(console.error)
