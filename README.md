# Issue Interceptor Action

Intercept issues and comments based on regex matching.

## Inputs

### `test-regex`

* **_Required_**
* **_Example_** `"/foo|bar/i"`
* The regex expression to test title or body of the issue or comment.

### `token`

* **_Default_** `${{ github.token }}`
* Github token.

### `title-override`

* **_Default_** `xxx`
* Reset the title of the issue.

### `body-override`

* **_Default_** `xxx`
* Reset the body of the issue or comment.

### `lock-reason`

* **_Default_** `spam`
* The reason for locking the issue conversation.

## Outputs


## Example usage

```yaml
name: Lock Issue

on:
  issues:
    types: [opened, edited, reopened]

jobs:
  lock-issue:
    runs-on: ubuntu-latest
    steps:
      - name: lock issue
        uses: pansong291/issue-interceptor-action@v1.0
        with:
          test-regex: '/shite/i'
          token: ${{ secrets.GITHUB_TOKEN }}
          title-override: 'f*ck you'
          body-override: 'b*tch'
          lock-reason: 'spam'
```
