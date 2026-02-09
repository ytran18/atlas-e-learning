import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { adminDb } from "@/libs/firebase/firebaseAdmin.config";

export async function POST(req: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();

        const { certificateId, studentName, courseName, birthYear, userIdCard, generatedFrom } =
            data;

        // Validate required fields
        if (!certificateId || !studentName || !courseName || !birthYear) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const certificateData = {
            certificateId,
            studentName,
            courseName,
            birthYear,
            userIdCard: userIdCard || null,
            generatedFrom: generatedFrom || "manual",
            issuedAt: new Date(),
            issuedBy: userId,
        };

        // Save to Firestore
        await adminDb.collection("certificates").doc(certificateId).set(certificateData);

        return NextResponse.json({
            success: true,
            certificateId,
        });
    } catch (error) {
        console.error("Error saving certificate:", error);
        return NextResponse.json({ error: "Failed to save certificate" }, { status: 500 });
    }
}
