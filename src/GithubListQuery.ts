import {ArgObject, QueryType} from "gotql/dist/types/QueryType";

const MAX_FIRST: number = 100;

export const NULL_ARG: ArgObject = {
    value: "null",
    escape: false,
}

export class GithubListQuery {
    constructor(
        public readonly base: string,
        private readonly baseArgs: Record<string, string | ArgObject>,
        public readonly requested: string,
        private readonly objectFields: string[],
    ) {
    }

    public get(cursor: string | ArgObject): QueryType {
        return {
            operation: {
                name: this.base,
                fields: [{
                    [this.requested]: {
                        args: {
                            first: {
                                value: MAX_FIRST,
                                escape: false,
                            },
                            after: cursor,
                        },
                        fields: [{
                            edges: {
                                fields: [
                                    "cursor",
                                    {
                                        node: {
                                            fields: this.objectFields,
                                        },
                                    },
                                ],
                            },
                        }],
                    },
                }],
                args: this.baseArgs,
            }
        };
    }
}