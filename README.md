# mirror-repos

Script to mirror all repos from a github account.

# Usage

- Add an SSH key for your current user to your GitHub account 
- Create a GitHub Personal Access Token with `read:user` and `read:org` scopes.
- Create a `config.json` file with the following contents:

```json
{
  "outputDirectory": "output",
  "logFile": "mirror-repos.log",
  "logLevel": "info",
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