const gotql = require("gotql");
const secrets = require("./secrets.json");

const endpoint = "https://api.github.com/graphql";
const accessToken = secrets.github.personalAccessToken;
const literal = gotql.literal;

const node = {
  node: {
    fields: [
      "id",
      "sshUrl",
      "name",
    ],
  },
};

const edges = {
  edges: {
    fields: [
      "cursor",
      node,
    ],
  },
};

const repositories = {
  repositories: {
    args: {
      first: literal`10`,
    },
    fields: [
      edges,
    ],
  },
};

const query = {
  operation: {
    name: "viewer",
    fields: [
      repositories,
    ],
  },
};

const options = {
  headers: {
    Authorization: "Bearer " + accessToken
  },
  debug: false,
  useHttp2: false,
};

function printRepositories(response) {
  var edges = response
    .data
    .viewer
    .repositories
    .edges;
  console.log(edges);
}

gotql.query(endpoint, query, options)
  .then(printRepositories)
  .catch(console.error)

