import { StudentStats } from "@/types/api";

export const formatXLSXData = (data: StudentStats): any => {
    return {
        "Họ tên": data.fullname,
        "CCCD/Passport": data.userIdCard,
        "Ngày sinh": data.birthDate,
        "Công ty": data.companyName,
        "Khóa học": data.courseName,
        "Đã hoàn thành": data.isCompleted ? "✓" : "✗",
        "Bắt đầu vào lúc": data.startedAt,
        "Lần cập nhật cuối": data.lastUpdatedAt,
        "Hình sau khi học": data.finishImageUrl,
    };
};
