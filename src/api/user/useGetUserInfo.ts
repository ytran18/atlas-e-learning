import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { getUserById } from "@/services";
import { UserInfo } from "@/types/api";

export const userInfoKeys = {
    all: ["userInfo"] as const,
    detail: (userId: string) => [...userInfoKeys.all, userId] as const,
};

export function useGetUserInfo(
    userId: string,
    options?: Omit<UseQueryOptions<UserInfo, Error>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: userInfoKeys.detail(userId),
        queryFn: () => getUserById(userId),
        enabled: !!userId,
        ...options,
    });
}
