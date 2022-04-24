"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const rxjs_1 = require("rxjs");
const gotql_1 = require("gotql");
const MAX_FIRST = 100;
const NULL_ARG = {
    value: "null",
    escape: false,
};
function nodeField(objectFields) {
    return {
        node: {
            fields: objectFields.slice(),
        },
    };
}
function edgesField(objectFields) {
    return {
        edges: {
            fields: [
                "cursor",
                nodeField(objectFields),
            ],
        },
    };
}
function requestedField(requested, objectFields, cursor) {
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
function viewerOperation(requested, objectFields, cursor) {
    return {
        name: "viewer",
        fields: [
            requestedField(requested, objectFields, cursor),
        ],
    };
}
function getQuery(requested, objectFields, cursor) {
    return {
        operation: viewerOperation(requested, objectFields, cursor),
    };
}
class List {
    constructor(endpoint, accessToken) {
        this.endpoint = endpoint;
        this.accessToken = accessToken;
    }
    getOptions() {
        return {
            headers: {
                Authorization: "Bearer " + this.accessToken
            },
            useHttp2: false,
        };
    }
    notify(requested, objectFields, subscriber) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.getOptions();
            let hasMore = true;
            let cursor = NULL_ARG;
            while (hasMore) {
                hasMore = false;
                const response = yield (0, gotql_1.query)(this.endpoint, getQuery(requested, objectFields, cursor), options);
                if (response.errors !== undefined) {
                    subscriber.error(response.errors);
                }
                else if (response.data !== undefined) {
                    const edges = response.data.viewer[requested].edges;
                    const length = edges.length;
                    if (length > 0) {
                        hasMore = true;
                        cursor = edges[length - 1].cursor;
                        for (const edge of edges) {
                            subscriber.next(edge.node);
                        }
                    }
                    else {
                        subscriber.complete();
                    }
                }
                else {
                    subscriber.error(`Neither data not errors returned from GraphQL query for ${requested}`);
                }
            }
        });
    }
    query(requested, objectFields) {
        return new rxjs_1.Observable(subscriber => {
            this.notify(requested, objectFields, subscriber)
                .catch(subscriber.error.bind(subscriber));
        });
    }
}
exports.List = List;
