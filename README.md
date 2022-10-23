# Budibase Datasource - Jira Cloud Filters
Manage Jira Cloud filters. Uses Jira REST API V2, you can find the docs for it [here](https://developer.atlassian.com/cloud/jira/platform/rest/v2/intro).

## Auth
Uses Basic Auth with an API Token. For more info on setting this up, check [here](https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis).

# Trying it out
JIra Cloud isn't free, but you can start a free trial using a new account which will allow testing the queries in this datasource.
## Create and Update operations
Below is an example config to create a new filter (POST/PUT request body):
```json
{
	"name": "Budibase Filter",
	"jql": "project = Budibase"
}
```