import { Document, Font, Image, Page, Text, View } from "@react-pdf/renderer";

import { ExamAnswer, ExamQuestion } from "@/types/api";

type UserExamTemplateProps = {
    examQuestions: ExamQuestion[];
    userAnswers: ExamAnswer[];
    userFullname: string;
    userBirthDate: string;
    userIdcard: string;
    userImage: string;
    currentCourseName: string;
};

Font.register({
    family: "Roboto",
    fonts: [
        {
            src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf",
            fontWeight: 400,
        },
        {
            src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf",
            fontWeight: 700,
        },
    ],
});

const UserExamTemplate = ({
    examQuestions,
    userAnswers,
    userFullname,
    userBirthDate,
    userIdcard,
    userImage,
    currentCourseName,
}: UserExamTemplateProps) => {
    console.log({ userImage });

    return (
        <Document>
            <Page
                style={{
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    gap: 4,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        gap: 20,
                        alignItems: "flex-start",
                    }}
                >
                    {/* Cột trái: Ảnh và thông tin theo chiều dọc */}
                    <View style={{ flexDirection: "column", gap: 15, flex: 1 }}>
                        {/* Ô vuông hình ảnh học sinh */}
                        <View
                            style={{
                                width: 100,
                                height: 120,
                                border: "1px solid #000",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                src={userImage}
                                style={{
                                    objectFit: "contain",
                                }}
                            />
                        </View>

                        {/* Thông tin chi tiết */}
                        <View style={{ gap: 4 }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                }}
                            >
                                <View style={{ width: "30%" }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            fontFamily: "Roboto",
                                        }}
                                        fixed
                                    >
                                        Họ và tên:
                                    </Text>
                                </View>

                                <View style={{ width: "70%" }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            fontFamily: "Roboto",
                                        }}
                                        fixed
                                    >
                                        {userFullname}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                }}
                            >
                                <View style={{ width: "30%" }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            fontFamily: "Roboto",
                                        }}
                                        fixed
                                    >
                                        Ngày sinh:
                                    </Text>
                                </View>

                                <View style={{ width: "70%" }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            fontFamily: "Roboto",
                                        }}
                                        fixed
                                    >
                                        {userBirthDate}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                }}
                            >
                                <View style={{ width: "30%" }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            fontFamily: "Roboto",
                                        }}
                                        fixed
                                    >
                                        CCCD/Passport:
                                    </Text>
                                </View>

                                <View style={{ width: "70%" }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            fontFamily: "Roboto",
                                        }}
                                        fixed
                                    >
                                        {userIdcard}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                }}
                            >
                                <View style={{ width: "30%" }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            fontFamily: "Roboto",
                                        }}
                                        fixed
                                    >
                                        Khóa học:
                                    </Text>
                                </View>

                                <View style={{ width: "70%" }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            fontFamily: "Roboto",
                                        }}
                                        fixed
                                    >
                                        {currentCourseName}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Cột phải: Ô vuông để ghi điểm */}
                    <View
                        style={{
                            width: 120,
                            height: 120,
                            border: "1px solid #000",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                fontFamily: "Roboto",
                                color: "#666",
                            }}
                        >
                            Điểm
                        </Text>
                    </View>
                </View>

                {/* Danh sách câu hỏi và câu trả lời */}
                <View style={{ marginTop: 20, gap: 12 }}>
                    {examQuestions.map((question, index) => {
                        const userAnswer = userAnswers?.find(
                            (answer) => answer.questionId === question.id
                        );

                        return (
                            <View key={question.id} style={{ gap: 6 }}>
                                {/* Câu hỏi */}
                                <View style={{ flexDirection: "row", gap: 6 }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            fontFamily: "Roboto",
                                        }}
                                    >
                                        {index + 1}.
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            fontFamily: "Roboto",
                                            flex: 1,
                                        }}
                                    >
                                        {question.content}
                                    </Text>
                                </View>

                                {/* Danh sách đáp án */}
                                <View style={{ paddingLeft: 20, gap: 4 }}>
                                    {question.options.map((option, optIndex) => {
                                        const isCorrectAnswer = option.id === question.answer;
                                        const isUserAnswer = userAnswer?.answer === option.id;

                                        // Xác định màu sắc
                                        let textColor = "#000"; // Mặc định màu đen
                                        if (isCorrectAnswer) {
                                            textColor = "#22c55e"; // Xanh lá cho đáp án đúng
                                        } else if (isUserAnswer) {
                                            textColor = "#ef4444"; // Đỏ cho đáp án sai của user
                                        }

                                        return (
                                            <View
                                                key={option.id}
                                                style={{ flexDirection: "row", gap: 6 }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 11,
                                                        fontFamily: "Roboto",
                                                        color: textColor,
                                                    }}
                                                >
                                                    {String.fromCharCode(65 + optIndex)}.
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 11,
                                                        fontFamily: "Roboto",
                                                        flex: 1,
                                                        color: textColor,
                                                    }}
                                                >
                                                    {option.content}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        );
                    })}
                </View>
            </Page>
        </Document>
    );
};

export default UserExamTemplate;
