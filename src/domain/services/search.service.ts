import { SearchResult } from "../entities/search.entity";

export interface ISearchService{
    unifiedSearch(query: string): Promise<SearchResult>
}