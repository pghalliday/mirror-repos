# mirror-repos

Script to mirror all repos from a github account.

# Usage

- install with
  
```shell
npm install -g @pghalliday/mirror-repos
```

- Add an SSH key for your current user to your GitHub account 
- Create a GitHub Personal Access Token with `read:user` and `read:org` scopes.
- Create a `config.json` file with the following contents:

```json
{
  "outputDirectory": "output",
  "logFile": "mirror-repos.log",
  "logLevel": "info",
  "gitBinary": "git",
  "strictHostKeyChecking": true,
  "github": {
    "graphQLEndpoint": "https://api.github.com/graphql",
    "sshEndpoint": "git@github.com",
    "personalAccessToken": "YOUR_PERSONAL_ACCESS_TOKEN"
  }
}
```

- Run from the same directory as `config.json` with:

```shell
mirror-repos
```

- Or run using a config file from a different location with:

```shell
mirror-repos <PATH_TO_CONFIG>
```
