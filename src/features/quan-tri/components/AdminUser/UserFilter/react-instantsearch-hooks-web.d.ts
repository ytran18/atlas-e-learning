declare module "react-instantsearch-hooks-web" {
    import type { ReactNode } from "react";
    import type { SearchClient } from "algoliasearch/lite";
    import type { Hit, BaseHit, SearchResults } from "instantsearch.js";

    export interface InstantSearchProps {
        searchClient: SearchClient;
        indexName: string;
        children?: ReactNode;
    }

    export interface ConfigureProps {
        attributesToRetrieve?: string[];
        attributesToHighlight?: string[];
        hitsPerPage?: number;
        [key: string]: unknown;
    }

    export interface SearchBoxProps {
        placeholder?: string;
        className?: string;
        queryHook?: (query: string, search: (value: string) => void) => void;
    }

    export interface HitsProps<THit extends BaseHit = BaseHit> {
        hitComponent: (props: { hit: THit }) => ReactNode;
    }

    export interface HighlightProps<THit extends BaseHit = BaseHit> {
        hit: THit;
        attribute: string;
    }

    export interface PaginationProps {
        className?: string;
        [key: string]: unknown;
    }

    export function InstantSearch(props: InstantSearchProps): ReactNode;
    export function Configure(props: ConfigureProps): ReactNode;
    export function SearchBox(props: SearchBoxProps): ReactNode;
    export function Hits<THit extends BaseHit = BaseHit>(props: HitsProps<THit>): ReactNode;
    export function Highlight<THit extends BaseHit = BaseHit>(
        props: HighlightProps<THit>
    ): ReactNode;
    export function Pagination(props?: PaginationProps): ReactNode;

    export interface UseInstantSearchReturn {
        results: SearchResults<Hit>;
        refresh: () => void;
    }

    export function useInstantSearch(): UseInstantSearchReturn;
}
