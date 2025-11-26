"use client";

import AdminDocsFile from "../components/docs/admin-docs-file";
import AdminDocsTabs from "../components/docs/admin-docs-tabs";
import AdminDocsVideo from "../components/docs/admin-docs-video";

const AdminDocsPage = () => {
    return (
        <div className="flex-1 w-full">
            <AdminDocsTabs
                slots={{
                    File: () => <AdminDocsFile />,
                    Video: () => <AdminDocsVideo />,
                }}
            />
        </div>
    );
};

export default AdminDocsPage;
