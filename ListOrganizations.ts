import {inject, injectable} from "tsyringe";
import {Observable} from "rxjs";
import {Organization, ORGANIZATION_FIELDS} from "./Types";
import {CONTAINER_SYMBOLS} from "./ContainerSymbols";
import {List} from "./List";

@injectable()
export class ListOrganizations extends List<Organization> {
    constructor(
        @inject(CONTAINER_SYMBOLS.githubEndpoint) endpoint: string,
        @inject(CONTAINER_SYMBOLS.githubAccessToken) accessToken: string,
    ) {
        super(endpoint, accessToken);
    }

    public query(): Observable<Organization> {
        return super.query(
            "viewer",
            {},
            "organizations",
            ORGANIZATION_FIELDS,
        );
    }
}
