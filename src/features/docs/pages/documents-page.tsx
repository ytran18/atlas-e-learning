"use client";

import { useSearchParams } from "next/navigation";

import algoliasearch from "algoliasearch/lite";
import { Configure, InstantSearch } from "react-instantsearch-hooks-web";

import DocumentsFile from "../components/documents-file";
import DocumentsHeroSection from "../components/documents-hero-section";
import DocumentsTabs from "../components/documents-tabs";
import DocumentsVideo from "../components/documents-video/inde";

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
);

const DocumentsPage = () => {
    const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME_DOCUMENTS!;

    const searchParams = useSearchParams();

    const currentTab = searchParams.get("tab") ?? "file";

    return (
        <div className="w-full h-[calc(100vh-60px)]">
            <DocumentsHeroSection />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-gray-50/30">
                <div className="max-w-7xl mx-auto">
                    <InstantSearch searchClient={searchClient} indexName={indexName}>
                        <Configure
                            filters={`type:"${currentTab}"`}
                            facets={["type"]}
                            attributesToRetrieve={[
                                "title",
                                "type",
                                "createdAt",
                                "description",
                                "id",
                                "sortNo",
                                "url",
                            ]}
                            hitsPerPage={10}
                        />
                        <DocumentsTabs
                            slots={{
                                File: () => <DocumentsFile />,
                                Video: () => <DocumentsVideo />,
                            }}
                        />
                    </InstantSearch>
                </div>
            </div>
        </div>
    );
};

export default DocumentsPage;
