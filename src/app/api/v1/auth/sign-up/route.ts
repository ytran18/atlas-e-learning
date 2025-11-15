import { NextRequest, NextResponse } from "next/server";

import { Role } from "@/features/auth/services";
import { admin, adminDb } from "@/libs/firebase/firebaseAdmin.config";

interface SignUpRequestBody {
    userId: string;
    fullName: string;
    birthDate: string;
    cccd: string;
    companyName?: string;
    photoUrl?: string;
    role: Role;
    jobTitle?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: SignUpRequestBody = await request.json();

        const { userId, fullName, birthDate, cccd, companyName, photoUrl, role, jobTitle } = body;

        // Validate required fields
        if (!userId || !fullName || !birthDate || !cccd || !role) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing required fields",
                },
                { status: 400 }
            );
        }

        // Check if Firebase Admin is initialized
        if (!admin.apps.length) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Firebase Admin SDK not initialized",
                },
                { status: 500 }
            );
        }

        // Create user document in Firestore using Admin SDK
        await adminDb
            .collection("users")
            .doc(userId)
            .set({
                fullName,
                birthDate,
                cccd,
                companyName: companyName || "",
                photoUrl: photoUrl || "",
                role,
                jobTitle: jobTitle || "",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

        return NextResponse.json(
            {
                success: true,
                message: "User created successfully",
                data: {
                    userId,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: "Failed to create user",
                details: error instanceof Error ? error.message : "Unknown error",
                errorName: error instanceof Error ? error.name : "Unknown",
            },
            { status: 500 }
        );
    }
}
