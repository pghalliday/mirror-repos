import {inject, injectable} from "tsyringe";
import {Observable} from "rxjs";
import {Repository, REPOSITORY_FIELDS} from "./Types";
import {CONTAINER_SYMBOLS} from "./ContainerSymbols";
import {List} from "./List";

@injectable()
export class ListRepositories extends List<Repository> {
    constructor(
        @inject(CONTAINER_SYMBOLS.githubEndpoint) endpoint: string,
        @inject(CONTAINER_SYMBOLS.githubAccessToken) accessToken: string,
    ) {
        super(endpoint, accessToken);
    }

    public query(): Observable<Repository> {
        return super.query("repositories", REPOSITORY_FIELDS);
    }
}