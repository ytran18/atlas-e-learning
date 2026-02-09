"use client";

import { useMemo } from "react";

import { Alert, Avatar, Badge, Button, Text } from "@mantine/core";
import { IconSearch, IconUser, IconUserCheck } from "@tabler/icons-react";
import { SearchBox, useInstantSearch } from "react-instantsearch-hooks-web";

import { useGetAllCourseLists } from "@/api/user/useGetAllCourseLists";

import { QRCodeData, StudentSearchResult } from "../types";

interface StudentSearchProps {
    onStudentSelected: (data: QRCodeData) => void;
    onError: (error: string) => void;
}

const StudentSearch = ({ onStudentSelected }: StudentSearchProps) => {
    const { results } = useInstantSearch();

    const { data: courseList } = useGetAllCourseLists();

    const hits = (results?.hits || []) as StudentSearchResult[];

    // Create a map of groupId -> courseName for O(1) lookups
    const courseNameMap = useMemo(() => {
        if (!courseList || !Array.isArray(courseList)) return new Map<string, string>();

        const map = new Map<string, string>();

        // courseList is an array of all courses (both ATLD and Học Nghề)
        courseList.forEach((course) => {
            if (course.id && course.title) {
                map.set(course.id, course.title);
            }
        });

        return map;
    }, [courseList]);

    const handleSelectStudent = (student: StudentSearchResult) => {
        // Get course name from map
        const courseName =
            courseNameMap.get(student.groupId || "") || student.groupId || "Chưa xác định";

        // Map Algolia student data to QRCodeData format (matching QR scanner structure)
        // We'll add courseName as a temporary field for the certificate form
        const qrData: QRCodeData & { courseName?: string } = {
            id1: "",
            id2: "",
            name: student.userFullname,
            birthDate: student.userBirthDate,
            gender: "",
            country: "VN",
            dateOfIssue: "",
            courseName, // Add course name for auto-fill
        };

        onStudentSelected(qrData);
    };

    const isSearching = results?.processingTimeMS !== undefined;

    const hasQuery = !!results?.query;

    return (
        <div className="space-y-4">
            {/* Search Input - using SearchBox from Algolia */}
            <SearchBox
                placeholder="Nhập số CCCD hoặc tên học viên để tìm kiếm..."
                className="w-full [&_input]:w-full [&_input]:px-4 [&_input]:py-2 [&_input]:border [&_input]:border-slate-300 [&_input]:rounded-lg [&_input]:focus:border-blue-500 [&_input]:focus:outline-none [&_button]:hidden"
            />

            {/* Helper Text */}
            <Text className="text-xs text-slate-500">
                💡 Tìm kiếm học viên trong hệ thống - Badge xanh cho học viên đã hoàn thành
            </Text>

            {/* Search Results */}
            {hasQuery && (
                <div className="space-y-3">
                    {isSearching && hits.length === 0 && (
                        <div className="text-center py-8">
                            <Text className="text-sm text-slate-600">Đang tìm kiếm...</Text>
                        </div>
                    )}

                    {!isSearching && hits.length === 0 && (
                        <Alert color="yellow" className="rounded-lg">
                            <Text className="text-sm">
                                Không tìm thấy học viên nào với thông tin này.
                            </Text>
                        </Alert>
                    )}

                    {hits.length > 0 && (
                        <>
                            <Text className="text-sm font-semibold text-slate-700">
                                Tìm thấy {hits.length} học viên
                            </Text>

                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {hits.map((student: StudentSearchResult) => {
                                    const isCompleted = Boolean(student.isCompleted);

                                    const courseName =
                                        courseNameMap.get(student.groupId || "") ||
                                        student.groupId ||
                                        "Chưa xác định";

                                    const isCourseATLD = student.groupId
                                        ?.toUpperCase()
                                        .startsWith("ATLD");

                                    return (
                                        <div
                                            key={student.objectID}
                                            className="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                                            onClick={() => handleSelectStudent(student)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    handleSelectStudent(student);
                                                }
                                            }}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            <div className="flex items-center gap-4">
                                                <Avatar
                                                    size="lg"
                                                    className="bg-blue-100 text-blue-600"
                                                >
                                                    <IconUser className="w-6 h-6" />
                                                </Avatar>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Text className="font-semibold text-slate-900">
                                                            {student.userFullname}
                                                        </Text>

                                                        <Badge
                                                            size="sm"
                                                            color={isCompleted ? "green" : "gray"}
                                                            variant="filled"
                                                        >
                                                            {isCompleted
                                                                ? "✓ Đã hoàn thành"
                                                                : "Đang học"}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge
                                                            size="sm"
                                                            color={isCourseATLD ? "blue" : "green"}
                                                            variant="light"
                                                        >
                                                            {courseName}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                                        <span>CCCD: {student.cccd}</span>

                                                        <span>•</span>

                                                        <span>
                                                            Sinh:{" "}
                                                            {new Date(
                                                                student.userBirthDate
                                                            ).toLocaleDateString("vi-VN")}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Button
                                                    size="sm"
                                                    leftSection={
                                                        <IconUserCheck className="w-4 h-4" />
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Chọn
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Initial State */}
            {!hasQuery && (
                <div className="bg-slate-50 rounded-lg p-12 mt-2 text-center border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-200 flex items-center justify-center">
                        <IconSearch className="w-8 h-8 text-slate-400" />
                    </div>

                    <Text className="text-slate-500 font-medium">
                        Nhập số CCCD hoặc tên để tìm kiếm học viên
                    </Text>

                    <Text className="text-xs text-slate-400 mt-2">
                        Tối thiểu 2 ký tự để bắt đầu tìm kiếm
                    </Text>
                </div>
            )}
        </div>
    );
};

export default StudentSearch;
