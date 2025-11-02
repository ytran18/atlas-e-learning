"use client";

import { FunctionComponent, PropsWithChildren, createContext, useContext, useState } from "react";

import { CourseDetail } from "@/types/api";

export type AdminDetailProviderProps = PropsWithChildren<{
    courseDetail: CourseDetail;
}>;

interface AdminDetailContextType extends AdminDetailProviderProps {
    isEditMode: boolean;
    setIsEditMode: (value: boolean) => void;
}

const AdminDetailContext = createContext<AdminDetailContextType | null>(null);

export const AdminDetailProvider: FunctionComponent<AdminDetailProviderProps> = ({
    children,
    courseDetail,
}) => {
    const [isEditMode, setIsEditMode] = useState(false);

    return (
        <AdminDetailContext.Provider value={{ courseDetail, isEditMode, setIsEditMode }}>
            {children}
        </AdminDetailContext.Provider>
    );
};

export const useAtldAdminDetailContext = () => {
    const context = useContext(AdminDetailContext);

    if (!context) throw new Error("useAdminDetailContext must be used within AdminDetailProvider");

    return context;
};

export const useHocNgheAdminDetailContext = () => {
    const context = useContext(AdminDetailContext);

    if (!context) throw new Error("useAdminDetailContext must be used within AdminDetailProvider");

    return context;
};
