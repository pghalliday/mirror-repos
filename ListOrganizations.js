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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListOrganizations = void 0;
const tsyringe_1 = require("tsyringe");
const Types_1 = require("./Types");
const ContainerSymbols_1 = require("./ContainerSymbols");
const List_1 = require("./List");
let ListOrganizations = class ListOrganizations extends List_1.List {
    constructor(endpoint, accessToken) {
        super(endpoint, accessToken);
    }
    query() {
        return super.query("viewer", {}, "organizations", Types_1.ORGANIZATION_FIELDS);
    }
};
ListOrganizations = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(ContainerSymbols_1.CONTAINER_SYMBOLS.githubEndpoint)),
    __param(1, (0, tsyringe_1.inject)(ContainerSymbols_1.CONTAINER_SYMBOLS.githubAccessToken))
], ListOrganizations);
exports.ListOrganizations = ListOrganizations;
