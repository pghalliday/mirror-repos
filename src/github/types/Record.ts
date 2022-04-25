import {GithubRepository} from "./GithubGraphQLResponse";

export interface Record extends Readonly<{
    remainingIds: readonly string[],
    updated: readonly GithubRepository[],
}> {}