import { IconShield } from "@tabler/icons-react";
import { IconUsers } from "@tabler/icons-react";

// Mock data cho 6 nhóm ATLĐ
export const atldGroups = [
    { id: 1, name: "Nhóm 1 - Quản lý, giám sát", icon: IconUsers, color: "blue" },
    { id: 2, name: "Nhóm 2 - Lao động phổ thông", icon: IconShield, color: "green" },
    { id: 3, name: "Nhóm 3 - Có yêu cầu nghiêm ngặt", icon: IconShield, color: "orange" },
    { id: 4, name: "Nhóm 4 - Có yêu cầu đặc biệt", icon: IconShield, color: "red" },
    { id: 5, name: "Nhóm 5 - Lao động nặng nhọc", icon: IconShield, color: "violet" },
    { id: 6, name: "Nhóm 6 - Lao động đặc biệt nặng", icon: IconShield, color: "pink" },
];

// Mock data cho học viên
export const mockStudents = [
    {
        id: 1,
        name: "Nguyễn Văn An",
        dateOfBirth: "01/01/1990",
        cccd: "123456789012",
        company: "Công ty ABC",
        avatar: "https://via.placeholder.com/40",
        theory: true,
        practice: true,
        exam: true,
        certificate: true,
    },
    {
        id: 2,
        name: "Trần Thị Bình",
        dateOfBirth: "15/02/1985",
        cccd: "987654321098",
        company: "Công ty XYZ",
        avatar: "https://via.placeholder.com/40",
        theory: true,
        practice: true,
        exam: false,
        certificate: false,
    },
    {
        id: 3,
        name: "Lê Văn Cường",
        dateOfBirth: "20/03/1992",
        cccd: "456789123456",
        company: "Công ty DEF",
        avatar: "https://via.placeholder.com/40",
        theory: true,
        practice: false,
        exam: false,
        certificate: false,
    },
];
