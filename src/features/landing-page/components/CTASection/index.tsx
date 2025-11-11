"use client";

import Link from "next/link";

import { useUser } from "@clerk/nextjs";
import { Button, Card } from "@mantine/core";

import { navigationPaths } from "@/utils/navigationPaths";

const CTASection = () => {
    const { isSignedIn } = useUser();

    if (isSignedIn) return null;

    return (
        <section className="py-20 bg-linear-to-b from-(--primary)/10 to-background">
            <div className="container mx-auto px-4">
                <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    className="bg-linear-to-br from-(--primary)/10 to-(--accent)/10"
                    withBorder
                >
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-(--mantine-color-dark-9)">
                            Sẵn sàng bắt đầu học?
                        </h2>
                        <p className="text-lg text-(--mantine-color-dark-5) mb-8">
                            Đăng ký ngay hôm nay để truy cập đầy đủ các khóa học an toàn lao động
                        </p>
                        <Button size="lg">
                            <Link href={navigationPaths.SIGN_UP}>Đăng ký miễn phí</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        </section>
    );
};

export default CTASection;
