import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/libs/axios/axios.config";

import { userInfoKeys } from "./useGetUserInfo";

interface UpdateUserInfoPayload {
    userId: string;
    fullName?: string;
    birthDate?: string; // Format: YYYY-MM-DD
    jobTitle?: string;
    companyName?: string;
    cccd?: string;
}

interface UpdateUserInfoResponse {
    success: boolean;
    message: string;
    data: {
        userId: string;
        updated: string[];
        passwordUpdated: boolean;
    };
}

async function updateUserInfo(payload: UpdateUserInfoPayload): Promise<UpdateUserInfoResponse> {
    const response = await axiosInstance.patch<UpdateUserInfoResponse>(
        "/v1/user/update-info",
        payload
    );

    return response.data;
}

export function useUpdateUserInfo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUserInfo,
        onSuccess: (data) => {
            // Invalidate user info query to refetch updated data
            queryClient.invalidateQueries({
                queryKey: userInfoKeys.detail(data.data.userId),
            });
        },
    });
}
