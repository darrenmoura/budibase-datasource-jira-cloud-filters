import { IntegrationBase } from "@budibase/types"
import fetch from "node-fetch"
import { DeleteQuery, JsonQuery, ReadQuery, SearchQuery, UpdateQuery } from "./types"
import { toBase64, trimUrlTrailingSlash } from "./util"

interface RequestOpts {
  method: string
  body?: string
  headers?: { [key: string]: string }
}

interface JiraApiConfig {
  atlassianDomainBaseUrl: string;
  username: string;
  apiToken: string;
}

const JIRA_V2_API_PATH = "/rest/api/2"
const JIRA_FILTER_PATH = `${JIRA_V2_API_PATH}/filter`;

class CustomIntegration implements IntegrationBase {
  private readonly jiraBaseUrl: string;
  private readonly authHeaderValue: string;

  constructor(config: JiraApiConfig) {
      this.jiraBaseUrl = trimUrlTrailingSlash(config.atlassianDomainBaseUrl);
      const encodedCreds = toBase64(`${config.username}:${config.apiToken}`);
      this.authHeaderValue = `Basic ${encodedCreds}`;
  }

  async create(query: JsonQuery) {
    const opts = {
      method: "POST",
      body: JSON.stringify(query.json),
      headers: {
        "Content-Type": "application/json",
      },
    }

    return this.request(`${this.jiraBaseUrl}${JIRA_FILTER_PATH}`, opts)
  }

  async read(query: ReadQuery) {
    const opts = {
      method: "GET",
    };

    return this.request(`${this.jiraBaseUrl}${JIRA_FILTER_PATH}/${query.filterId}`, opts);
  }

  async search(query: SearchQuery) {
    const url = new URL(`${this.jiraBaseUrl}${JIRA_FILTER_PATH}/search`);
    url.searchParams.append("startAt", String(query.startAt));
    url.searchParams.append("maxResults", String(query.maxResults));
    if (query.filterName) {
      url.searchParams.append("filterName", query.filterName);
    }
    if (query.accountId) {
      url.searchParams.append("accountId", query.accountId);
    }
    if (query.expand) {
      url.searchParams.append("expand", query.expand);
    }

    const opts = {
      method: "GET",
    };
    
    return this.request(url, opts);
  }

  async update(query: UpdateQuery) {
    const opts = {
      method: "PUT",
      body: JSON.stringify(query.json),
      headers: {
        "Content-Type": "application/json",
      },
    }

    return this.request(`${this.jiraBaseUrl}${JIRA_FILTER_PATH}/${query.filterId}`, opts);
  }

  async delete(query: DeleteQuery) {
    const opts = {
      method: "DELETE",
    }

    const successfulResponse = JSON.stringify({ filterId: query.filterId });

    return this.request(`${this.jiraBaseUrl}${JIRA_FILTER_PATH}/${query.filterId}`, opts, successfulResponse);
  }

  private async request(url: string | URL, opts: RequestOpts, successfulResponseReplacement?: string) {
    await this.addAuthHeader(opts);

    const response = await fetch(url, opts)
    if (response.status <= 300) {
      // Used if successful response from Jira API is empty
      if (successfulResponseReplacement) {
        return successfulResponseReplacement;
      }

      try {
        const contentType = response.headers.get("content-type")
        if (contentType?.includes("json")) {
          return await response.json()
        } else {
          return await response.text()
        }
      } catch (err) {
        return await response.text()
      }
    } else {
      const err = await response.text()
      throw new Error(err)
    }
  }

  private async addAuthHeader(opts: RequestOpts) {
    const authHeader = { Authorization: this.authHeaderValue };
    opts.headers = opts.headers ? { ...opts.headers, ...authHeader } : authHeader; 
  }
}

export default CustomIntegration
