"use client";

import Link from "next/link";

import { Badge, Button, Card } from "@mantine/core";
import {
    IconAward,
    IconBook,
    IconFileCheck,
    IconShield,
    IconUsers,
    IconVideo,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

import { fadeInUp, staggerContainer } from "@/animations/landing-page";
import { navigationPaths } from "@/utils/navigationPaths";

const LandingPage = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/10 to-[var(--background)]" />

                <div className="container mx-auto px-4 relative">
                    <motion.div
                        className="max-w-4xl mx-auto text-center"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
                            <Badge
                                className="mb-2"
                                variant="gradient"
                                gradient={{ from: "blue", to: "cyan", deg: 90 }}
                            >
                                <span className="leading-[22px]">
                                    Nền tảng đào tạo chuyên nghiệp
                                </span>
                            </Badge>
                        </motion.div>

                        <motion.h1
                            className="text-4xl md:text-6xl font-bold mb-6 text-balance"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            An toàn lao động cho mọi người
                        </motion.h1>

                        <motion.p
                            className="text-lg md:text-xl text-[#495057] mb-8 text-pretty max-w-2xl mx-auto"
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Nâng cao kiến thức và kỹ năng an toàn lao động với các khóa học chuyên
                            nghiệp, được thiết kế phù hợp với từng nhóm ngành nghề
                        </motion.p>

                        <motion.div variants={fadeInUp} transition={{ duration: 0.5, delay: 0.3 }}>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg">
                                    <Link href={navigationPaths.ATLD}>Bắt đầu học ngay</Link>
                                </Button>
                                <Button size="lg" variant="outline">
                                    <Link href={navigationPaths.ATLD}>Khám phá khóa học</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-b from-[var(--primary)]/10 to-[var(--background)]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--mantine-color-dark-9)]">
                            Tại sao chọn chúng tôi?
                        </h2>
                        <p className="text-[var(--mantine-color-dark-5)] max-w-2xl mx-auto">
                            Hệ thống đào tạo toàn diện với phương pháp học tập hiện đại
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <div className="h-12 w-12 rounded-lg bg-[var(--mantine-primary-color-1)] flex items-center justify-center mb-4">
                                <IconVideo className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-[var(--mantine-color-dark-9)]">
                                Video học tập
                            </h3>
                            <p className="text-[var(--mantine-color-dark-5)]">
                                Học qua video lý thuyết và thực hành chi tiết, dễ hiểu
                            </p>
                        </Card>

                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <div className="h-12 w-12 rounded-lg bg-[var(--mantine-primary-color-1)] flex items-center justify-center mb-4">
                                <IconFileCheck className="h-6 w-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-[var(--mantine-color-dark-9)]">
                                Kiểm tra đánh giá
                            </h3>
                            <p className="text-[var(--mantine-color-dark-5)]">
                                Bài kiểm tra sau mỗi khóa học để đánh giá kiến thức
                            </p>
                        </Card>

                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <div className="h-12 w-12 rounded-lg bg-[var(--mantine-primary-color-1)] flex items-center justify-center mb-4">
                                <IconAward className="h-6 w-6 text-success" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-[var(--mantine-color-dark-9)]">
                                Chứng chỉ
                            </h3>
                            <p className="text-[var(--mantine-color-dark-5)]">
                                Nhận chứng chỉ sau khi hoàn thành khóa học thành công
                            </p>
                        </Card>

                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <div className="h-12 w-12 rounded-lg bg-[var(--mantine-primary-color-1)] flex items-center justify-center mb-4">
                                <IconShield className="h-6 w-6 text-warning" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-[var(--mantine-color-dark-9)]">
                                6 nhóm ATLĐ
                            </h3>
                            <p className="text-[var(--mantine-color-dark-5)]">
                                Đào tạo đầy đủ 6 nhóm an toàn lao động theo quy định
                            </p>
                        </Card>

                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <div className="h-12 w-12 rounded-lg bg-[var(--mantine-primary-color-1)] flex items-center justify-center mb-4">
                                <IconBook className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-[var(--mantine-color-dark-9)]">
                                Học nghề
                            </h3>
                            <p className="text-[var(--mantine-color-dark-5)]">
                                Các khóa học nghề nghiệp chuyên sâu và thực tế
                            </p>
                        </Card>

                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <div className="h-12 w-12 rounded-lg bg-[var(--mantine-primary-color-1)] flex items-center justify-center mb-4">
                                <IconUsers className="h-6 w-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-[var(--mantine-color-dark-9)]">
                                Quản lý dễ dàng
                            </h3>
                            <p className="text-[var(--mantine-color-dark-5)]">
                                Hệ thống quản trị tiện lợi cho doanh nghiệp
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-b from-[var(--primary)]/10 to-[var(--background)]">
                <div className="container mx-auto px-4">
                    <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10"
                        withBorder
                    >
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--mantine-color-dark-9)]">
                                Sẵn sàng bắt đầu học?
                            </h2>
                            <p className="text-lg text-[var(--mantine-color-dark-5)] mb-8">
                                Đăng ký ngay hôm nay để truy cập đầy đủ các khóa học an toàn lao
                                động
                            </p>
                            <Button size="lg">
                                <Link href={navigationPaths.ATLD}>Đăng ký miễn phí</Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
