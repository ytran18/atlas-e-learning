import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/libs/firebase/firebaseAdmin.config";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const certificateId = searchParams.get("id");

    if (!certificateId) {
        return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 });
    }

    try {
        const docRef = adminDb.collection("certificates").doc(certificateId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
        }

        const data = doc.data();

        return NextResponse.json({
            success: true,
            certificate: {
                certificateId: data?.certificateId,
                studentName: data?.studentName,
                courseName: data?.courseName,
                birthYear: data?.birthYear,
                issuedAt: data?.issuedAt?.toDate().toISOString(),
            },
        });
    } catch (error) {
        console.error("Error verifying certificate:", error);
        return NextResponse.json({ error: "Failed to verify certificate" }, { status: 500 });
    }
}
