import { Suspense } from "react";

import AdminDocsPage from "@/features/quan-tri/pages/AdminDocsPage";

const DocsPage = () => {
    return (
        <Suspense fallback={<div>Loading ...</div>}>
            <AdminDocsPage />
        </Suspense>
    );
};

export default DocsPage;
