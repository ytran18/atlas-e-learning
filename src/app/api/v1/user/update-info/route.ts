import { NextRequest, NextResponse } from "next/server";

import { clerkClient } from "@clerk/nextjs/server";

import { admin } from "@/libs/firebase/firebaseAdmin.config";
import { updateUserInfo } from "@/services/firestore.service";
import { handleApiError, requireAuth } from "@/utils/api.utils";

interface UpdateUserInfoRequest {
    userId: string;
    fullName?: string;
    birthDate?: string; // Format: YYYY-MM-DD
    jobTitle?: string;
    companyName?: string;
    cccd?: string;
}

/**
 * Update user information in both Clerk and Firestore
 * If cccd or birthDate is changed, password will also be updated
 */
export async function PATCH(request: NextRequest) {
    try {
        await requireAuth();

        const body: UpdateUserInfoRequest = await request.json();
        const { userId, fullName, birthDate, jobTitle, companyName, cccd } = body;

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing userId",
                },
                { status: 400 }
            );
        }

        // Get current user data from Clerk
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found",
                },
                { status: 404 }
            );
        }

        // Prepare metadata updates
        const currentMetadata = user.unsafeMetadata || {};
        const updatedMetadata: Record<string, any> = { ...currentMetadata };

        if (fullName !== undefined) {
            updatedMetadata.fullName = fullName;
        }

        if (birthDate !== undefined) {
            updatedMetadata.birthDate = birthDate;
        }

        if (jobTitle !== undefined) {
            updatedMetadata.jobTitle = jobTitle;
        }

        if (companyName !== undefined) {
            updatedMetadata.companyName = companyName;
        }

        if (cccd !== undefined) {
            updatedMetadata.cccd = cccd;
        }

        // Determine if password needs to be updated
        const cccdChanged = cccd !== undefined && cccd !== currentMetadata.cccd;
        const birthDateChanged = birthDate !== undefined && birthDate !== currentMetadata.birthDate;
        const needsPasswordUpdate = cccdChanged || birthDateChanged;

        // Get final values for password generation
        const finalBirthDate = birthDate || (currentMetadata.birthDate as string);
        const finalCccd = cccd || (currentMetadata.cccd as string);

        // Update Clerk user metadata
        await clerk.users.updateUser(userId, {
            unsafeMetadata: updatedMetadata,
        });

        // If cccd or birthDate changed, update password and username
        if (needsPasswordUpdate && finalBirthDate && finalCccd) {
            // Normalize identifier: uppercase for passport, keep as is for CCCD
            const identifier = /^\d{12}$/u.test(finalCccd) ? finalCccd : finalCccd.toUpperCase();

            // Generate new password with format: YYYY-MM-DD_IDENTIFIER
            const password = `${finalBirthDate}_${identifier}`;

            // Determine username prefix
            const isCCCD = /^\d{12}$/u.test(finalCccd);
            const usernamePrefix = isCCCD ? "CC" : "PP";
            const newUsername = `${usernamePrefix}${identifier}`;

            // Update password
            await clerk.users.updateUser(userId, {
                password: password,
            });

            // Only update username if cccd changed
            if (cccdChanged && user.username !== newUsername) {
                await clerk.users.updateUser(userId, {
                    username: newUsername,
                });
            }
        }

        // Prepare Firestore updates
        const firestoreUpdates: Record<string, any> = {};

        if (fullName !== undefined) {
            firestoreUpdates.fullName = fullName;
        }

        if (birthDate !== undefined) {
            firestoreUpdates.birthDate = birthDate;
        }

        if (jobTitle !== undefined) {
            firestoreUpdates.jobTitle = jobTitle;
        }

        if (companyName !== undefined) {
            firestoreUpdates.companyName = companyName;
        }

        if (cccd !== undefined) {
            firestoreUpdates.cccd = cccd;
        }

        // Add updatedAt timestamp
        firestoreUpdates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

        // Update Firestore
        if (Object.keys(firestoreUpdates).length > 0) {
            await updateUserInfo(userId, firestoreUpdates);
        }

        return NextResponse.json(
            {
                success: true,
                message: "User information updated successfully",
                data: {
                    userId,
                    updated: Object.keys(firestoreUpdates),
                    passwordUpdated: needsPasswordUpdate,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user info:", error);
        return handleApiError(error);
    }
}
