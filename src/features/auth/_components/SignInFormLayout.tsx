"use client";

import { ReactNode } from "react";

import Link from "next/link";

import { Button, Card } from "@mantine/core";

interface SignInFormLayoutProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    onSubmit: (e: React.FormEvent) => void;
    submitButtonText: string;
    footerText: string;
    footerLinkText: string;
    footerLinkHref: string;
    isLoading?: boolean;
    error?: string;
}

const SignInFormLayout = ({
    title,
    subtitle,
    children,
    onSubmit,
    submitButtonText,
    footerText,
    footerLinkText,
    footerLinkHref,
    isLoading = false,
    error,
}: SignInFormLayoutProps) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 px-4 py-8">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                    <p className="text-gray-600">{subtitle}</p>
                </div>

                {/* Form Card */}
                <Card withBorder radius="lg" p="xl">
                    <form onSubmit={onSubmit} className="space-y-5">
                        {children}

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="!w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Đang xử lý..." : submitButtonText}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {footerText}{" "}
                            <Link
                                href={footerLinkHref}
                                className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                {footerLinkText}
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SignInFormLayout;
