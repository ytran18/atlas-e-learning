import { Suspense } from "react";

import AdminUserPage from "@/features/quan-tri/pages/AdminUserPage";

const UserPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminUserPage />
        </Suspense>
    );
};

export default UserPage;
