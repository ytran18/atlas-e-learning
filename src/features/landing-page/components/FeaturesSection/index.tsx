import { Card } from "@mantine/core";
import {
    IconAward,
    IconBook,
    IconFileCheck,
    IconShield,
    IconUsers,
    IconVideo,
} from "@tabler/icons-react";

const FeaturesSection = () => {
    return (
        <section className="py-20 bg-linear-to-b from-(--primary)/10 to-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-(--mantine-color-dark-9)">
                        Tại sao chọn chúng tôi?
                    </h2>
                    <p className="text-(--mantine-color-dark-5) max-w-2xl mx-auto">
                        Hệ thống đào tạo toàn diện với phương pháp học tập hiện đại
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <div className="h-12 w-12 rounded-lg bg-(--mantine-primary-color-1) flex items-center justify-center mb-4">
                            <IconVideo className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-(--mantine-color-dark-9)">
                            Video học tập
                        </h3>
                        <p className="text-(--mantine-color-dark-5)">
                            Học qua video lý thuyết và thực hành chi tiết, dễ hiểu
                        </p>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <div className="h-12 w-12 rounded-lg bg-(--mantine-primary-color-1) flex items-center justify-center mb-4">
                            <IconFileCheck className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-(--mantine-color-dark-9)">
                            Kiểm tra đánh giá
                        </h3>
                        <p className="text-(--mantine-color-dark-5)">
                            Bài kiểm tra sau mỗi khóa học để đánh giá kiến thức
                        </p>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <div className="h-12 w-12 rounded-lg bg-(--mantine-primary-color-1) flex items-center justify-center mb-4">
                            <IconAward className="h-6 w-6 text-success" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-(--mantine-color-dark-9)">
                            Chứng chỉ
                        </h3>
                        <p className="text-(--mantine-color-dark-5)">
                            Nhận chứng chỉ sau khi hoàn thành khóa học thành công
                        </p>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <div className="h-12 w-12 rounded-lg bg-(--mantine-primary-color-1) flex items-center justify-center mb-4">
                            <IconShield className="h-6 w-6 text-warning" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-(--mantine-color-dark-9)">
                            6 nhóm ATLĐ
                        </h3>
                        <p className="text-(--mantine-color-dark-5)">
                            Đào tạo đầy đủ 6 nhóm an toàn lao động theo quy định
                        </p>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <div className="h-12 w-12 rounded-lg bg-(--mantine-primary-color-1) flex items-center justify-center mb-4">
                            <IconBook className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-(--mantine-color-dark-9)">
                            Học nghề
                        </h3>
                        <p className="text-(--mantine-color-dark-5)">
                            Các khóa học nghề nghiệp chuyên sâu và thực tế
                        </p>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <div className="h-12 w-12 rounded-lg bg-(--mantine-primary-color-1) flex items-center justify-center mb-4">
                            <IconUsers className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-(--mantine-color-dark-9)">
                            Quản lý dễ dàng
                        </h3>
                        <p className="text-(--mantine-color-dark-5)">
                            Hệ thống quản trị tiện lợi cho doanh nghiệp
                        </p>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
