import axiosInstance from "@/libs/axios/axios.config";

export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
}

export interface CreateUserPayload {
    userId: string;
    fullName: string;
    birthDate: string;
    cccd: string;
    companyName?: string;
    photoUrl?: string;
    role: Role;
    jobTitle?: string;
}

export interface CreateUserResponse {
    success: boolean;
    message: string;
    data: {
        userId: string;
    };
}

export const authService = {
    /**
     * Create user in Firestore after successful sign up
     */
    createUser: async (payload: CreateUserPayload): Promise<CreateUserResponse> => {
        const response = await axiosInstance.post<CreateUserResponse>("/v1/auth/sign-up", payload);

        return response.data;
    },
};
