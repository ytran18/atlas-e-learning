"use client";

import { useParams } from "next/navigation";

import { useGetUserInfo } from "@/api/user/useGetUserInfo";

import UserLeftSection from "../components/user-left-section";
import UserRightSection from "../components/user-right-section";

const UserDetailPage = () => {
    const { userId } = useParams();

    const { data: userDetail } = useGetUserInfo(userId as string);

    return (
        <div className="h-[calc(100vh-60px)] w-screen flex flex-col gap-y-4 sm:grid sm:grid-cols-12 gap-x-10 px-10 py-5 bg-linear-to-br from-white via-blue-50 to-blue-100">
            <div className="col-span-4">
                <UserLeftSection user={userDetail as Record<string, any>} />
            </div>

            <div className="col-span-8">
                <UserRightSection user={userDetail as Record<string, any>} />
            </div>
        </div>
    );
};

export default UserDetailPage;
