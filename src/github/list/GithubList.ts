import {Observable, Subscriber} from "rxjs";
import {ArgObject} from "gotql/dist/types/QueryType";
import {UserOptions} from "gotql/dist/types/UserOptions";
import {GithubGraphQLResponse} from "../types/GithubGraphQLResponse";
import {query} from "gotql";
import {inject, singleton} from "tsyringe";
import {GithubListQuery, NULL_ARG} from "./GithubListQuery";
import {GithubConfig} from "../types/GithubConfig";
import {GITHUB_CONFIG} from "../tokens";

@singleton()
export class GithubList {
    constructor(
        @inject(GITHUB_CONFIG) private readonly githubConfig: GithubConfig,
    ) {
    }

    public query<ObjectType>(
        githubListQuery: GithubListQuery,
    ): Observable<ObjectType> {
        return new Observable<ObjectType>(subscriber => {
            this.notify(githubListQuery, subscriber)
                .catch(subscriber.error.bind(subscriber));
        });
    }

    private getOptions(): UserOptions {
        return {
            headers: {
                Authorization: "Bearer " + this.githubConfig.personalAccessToken,
            },
            useHttp2: false,
        };
    }

    private async notify<ObjectType>(
        githubListQuery: GithubListQuery,
        subscriber: Subscriber<ObjectType>,
    ): Promise<void> {
        const options = this.getOptions();
        let hasMore = true;
        let cursor: string | ArgObject = NULL_ARG;
        while (hasMore) {
            hasMore = false;
            const response: GithubGraphQLResponse<ObjectType> = await query(
                this.githubConfig.endpoint,
                githubListQuery.get(cursor),
                options,
            );
            if (response.errors !== undefined) {
                subscriber.error(response.errors);
            } else if (response.data !== undefined) {
                const edges = response.data[githubListQuery.base][githubListQuery.requested].edges;
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
                subscriber.error(`Neither data not errors returned from GraphQL query for ${githubListQuery.requested}`);
            }
        }
    }
}
