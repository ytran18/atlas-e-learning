export interface SaveCertificateData {
    certificateId: string;
    studentName: string;
    courseName: string;
    birthYear: string;
    userIdCard?: string;
    generatedFrom?: "qr-scan" | "manual-search" | "manual";
}

export const saveCertificate = async (
    data: SaveCertificateData
): Promise<{ success: boolean; certificateId: string }> => {
    const response = await fetch("/api/certificate/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save certificate");
    }

    return response.json();
};
