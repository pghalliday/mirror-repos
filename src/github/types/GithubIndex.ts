import {assertMapOf} from "../../types/util";
import {assertGithubRepository, GithubRepository} from "./GithubGraphQLResponse";

export interface GithubIndex extends Readonly<Record<string, GithubRepository>> {
}

export function assertGithubIndex(scope: string, value: unknown): asserts value is GithubIndex {
    assertMapOf(scope, value, assertGithubRepository);
}
