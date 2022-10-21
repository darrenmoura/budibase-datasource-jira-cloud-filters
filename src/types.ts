export interface JsonQuery {
    json: object;
}

export interface ReadQuery {
    filterId: string;
}

export interface SearchQuery {
    startAt: number;
    maxResults: number;
    filterName?: string;
    accountId?: string;
    expand?: string;
}

export interface UpdateQuery {
    filterId: string;
    json: object;
}

export interface DeleteQuery {
    filterId: string;
}

export interface AssignQuery {
    issueIdOrKey: string;
    accountId: string;
}

export interface UnassignQuery {
    issueIdOrKey: string;
}