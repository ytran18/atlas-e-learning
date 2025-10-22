"use client";

import { FunctionComponent, PropsWithChildren, createContext, useContext, useState } from "react";

import { CourseDetail } from "@/types/api";

export type AtldAdminDetailProviderProps = PropsWithChildren<{
    courseDetail: CourseDetail;
}>;

interface AtldAdminDetailContextType extends AtldAdminDetailProviderProps {
    isEditMode: boolean;
    setIsEditMode: (value: boolean) => void;
}

const AtldAdminDetailContext = createContext<AtldAdminDetailContextType | null>(null);

export const AtldAdminDetailProvider: FunctionComponent<AtldAdminDetailProviderProps> = ({
    children,
    courseDetail,
}) => {
    const [isEditMode, setIsEditMode] = useState(false);

    return (
        <AtldAdminDetailContext.Provider value={{ courseDetail, isEditMode, setIsEditMode }}>
            {children}
        </AtldAdminDetailContext.Provider>
    );
};

export const useAtldAdminDetailContext = () => {
    const context = useContext(AtldAdminDetailContext);

    if (!context)
        throw new Error("useAtldAdminDetailContext must be used within AtldAdminDetailProvider");

    return context;
};
