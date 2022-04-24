"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.ListOrganizations = void 0;
const tsyringe_1 = require("tsyringe");
const rxjs_1 = require("rxjs");
const gotql_1 = require("gotql");
const ContainerSymbols_1 = require("./ContainerSymbols");
const MAX_FIRST = 100;
const NULL_ARG = {
    value: "null",
    escape: false,
};
const NODE_FIELD = {
    node: {
        fields: [
            "id",
            "name",
        ],
    },
};
const EDGES_FIELD = {
    edges: {
        fields: [
            "cursor",
            NODE_FIELD,
        ],
    },
};
function organizationsField(cursor) {
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
function viewerOperation(cursor) {
    return {
        name: "viewer",
        fields: [
            organizationsField(cursor),
        ],
    };
}
function getOrganizationsQuery(cursor) {
    return {
        operation: viewerOperation(cursor),
    };
}
let ListOrganizations = class ListOrganizations {
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
    notifyOrganizations(subscriber) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.getOptions();
            let hasMore = true;
            let cursor = NULL_ARG;
            while (hasMore) {
                hasMore = false;
                const response = yield (0, gotql_1.query)(this.endpoint, getOrganizationsQuery(cursor), options);
                if (response.errors !== undefined) {
                    subscriber.error(response.errors);
                }
                else if (response.data !== undefined) {
                    const organizationEdges = response.data.viewer.organizations.edges;
                    const length = organizationEdges.length;
                    if (length > 0) {
                        hasMore = true;
                        cursor = organizationEdges[length - 1].cursor;
                        for (const organizationEdge of organizationEdges) {
                            subscriber.next(organizationEdge.node);
                        }
                    }
                    else {
                        subscriber.complete();
                    }
                }
                else {
                    subscriber.error("Neither data not errors returned from GraphQL query for organizations");
                }
            }
        });
    }
    query() {
        return new rxjs_1.Observable(subscriber => {
            this.notifyOrganizations(subscriber)
                .catch(subscriber.error.bind(subscriber));
        });
    }
};
ListOrganizations = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(ContainerSymbols_1.CONTAINER_SYMBOLS.githubEndpoint)),
    __param(1, (0, tsyringe_1.inject)(ContainerSymbols_1.CONTAINER_SYMBOLS.githubAccessToken))
], ListOrganizations);
exports.ListOrganizations = ListOrganizations;
