# mirror-repos

Script to mirror all repos from a github account.

# Usage

- Create a GitHub Personal Access Token with `read:user` and `read:org` scopes.
- Create a `config.json` file with the following contents:

```json
{
  "outputDirectory": "output",
  "github": {
    "graphQLEndpoint": "https://api.github.com/graphql",
    "sshEndpoint": "git@github.com",
    "personalAccessToken": "YOUR_PERSONAL_ACCESS_TOKEN"
  }
}
```

- Build and run with:

```shell
npm start
```