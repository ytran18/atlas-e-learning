"use client";

import { useState } from "react";

import { Container } from "@mantine/core";
import algoliasearch from "algoliasearch/lite";
import { Configure, InstantSearch } from "react-instantsearch-hooks-web";

import EmptyState from "../_components/EmptyState";
import ErrorAlert from "../_components/ErrorAlert";
import FillForm from "../_components/Steps/FillForm";
import Preview from "../_components/Steps/Preview";
import UploadSearchVerify from "../_components/Steps/UploadSearchVerify";
import SuccessAlert from "../_components/SuccessAlert";
import { CertificateFormData, QRCodeData } from "../types";
import { extractBirthYear } from "../utils/qr-scanner";

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
);

const CertificatePage = () => {
    const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!;

    const [qrData, setQrData] = useState<QRCodeData | null>(null);

    const [formData, setFormData] = useState<CertificateFormData | null>(null);

    const [error, setError] = useState<string>("");

    const [showSuccess, setShowSuccess] = useState(false);

    const [activeMode, setActiveMode] = useState<"upload" | "search" | "verify">("upload");

    const handleQRScanned = (data: QRCodeData & { courseName?: string }) => {
        setQrData(data);

        setShowSuccess(true);

        setError("");

        const birthYear = extractBirthYear(data.birthDate);

        setFormData({
            studentName: data.name,
            courseName: data.courseName || "", // Auto-fill if from Algolia search
            birthYear: birthYear,
            certificateId: `CERT-${Date.now()}`,
        });

        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleFormSubmit = (data: CertificateFormData) => {
        setFormData(data);
    };

    const handleReset = () => {
        setQrData(null);
        setFormData(null);
        setError("");
        setShowSuccess(false);
    };

    return (
        <InstantSearch searchClient={searchClient} indexName={indexName}>
            <Configure
                attributesToRetrieve={[
                    "userFullname",
                    "cccd",
                    "userBirthDate",
                    "userIdCard",
                    "objectID",
                    "isCompleted",
                    "groupId",
                    "courseName",
                ]}
                hitsPerPage={10}
            />

            <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-50">
                <Container size="xl" className="py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                            Tạo Chứng Chỉ Tự Động
                        </h1>
                    </div>

                    {/* Success Alert */}
                    {showSuccess && <SuccessAlert />}

                    {/* Error Alert */}
                    {error && <ErrorAlert error={error} />}

                    {/* Step 1: Upload or Search */}
                    <UploadSearchVerify
                        qrData={qrData}
                        handleQRScanned={handleQRScanned}
                        setError={setError}
                        activeMode={activeMode}
                        setActiveMode={setActiveMode}
                        onReset={handleReset}
                    />

                    {/* Step 2: Fill Form */}
                    {qrData && activeMode !== "verify" && (
                        <FillForm
                            qrData={qrData}
                            formData={formData}
                            handleFormSubmit={handleFormSubmit}
                        />
                    )}

                    {/* Step 3: Preview & Download */}
                    {formData && activeMode !== "verify" && (
                        <Preview formData={formData} onReset={handleReset} />
                    )}

                    {/* Empty State */}
                    {!qrData && <EmptyState />}
                </Container>
            </div>
        </InstantSearch>
    );
};

export default CertificatePage;
