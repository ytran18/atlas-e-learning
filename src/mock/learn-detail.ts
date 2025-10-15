import { LearnDetail } from "@/types/learn-detail";

export const learnDetail: LearnDetail = {
    id: "course_atld_a1",
    title: "ATLD - Bằng lái A1",
    description:
        "Khóa học An toàn Lao động và lý thuyết dành cho người thi bằng lái xe máy hạng A1.",
    theory: {
        id: "theory_1",
        videos: [
            {
                id: "vid_t1_1",
                title: "Giới thiệu về An toàn Lao động",
                description:
                    "Tổng quan về tầm quan trọng của an toàn lao động trong công việc hàng ngày.",
                url: "https://example.com/videos/intro_safety.mp4",
                length: 420,
                progress: 120,
                canSeek: true,
                shouldCompleteToPassed: true,
            },
            {
                id: "vid_t1_2",
                title: "Các nguyên tắc cơ bản khi làm việc an toàn",
                description:
                    "Những nguyên tắc quan trọng để đảm bảo an toàn trong quá trình lao động.",
                url: "https://example.com/videos/basic_rules.mp4",
                length: 600,
                progress: 0,
                canSeek: false,
                shouldCompleteToPassed: true,
            },
            {
                id: "vid_t1_3",
                title: "Nhận diện và phòng tránh rủi ro",
                description:
                    "Cách nhận biết các yếu tố nguy hiểm và phương pháp phòng tránh hiệu quả.",
                url: "https://example.com/videos/risk_prevention.mp4",
                length: 480,
                progress: 0,
                canSeek: true,
                shouldCompleteToPassed: false,
            },
        ],
    },
    practice: {
        id: "practice_1",
        videos: [
            {
                id: "vid_p1_1",
                title: "Thực hành kiểm tra xe trước khi vận hành",
                description:
                    "Các bước kiểm tra xe máy để đảm bảo an toàn trước khi tham gia giao thông.",
                url: "https://example.com/videos/precheck.mp4",
                length: 300,
                progress: 0,
                canSeek: false,
                shouldCompleteToPassed: true,
            },
            {
                id: "vid_p1_2",
                title: "Thực hành điều khiển xe an toàn",
                description:
                    "Thực hành lái xe an toàn trong khu vực giới hạn và điều kiện mô phỏng.",
                url: "https://example.com/videos/safe_driving.mp4",
                length: 540,
                progress: 540,
                canSeek: true,
                shouldCompleteToPassed: true,
            },
        ],
    },
    exam: [
        {
            id: "exam_1",
            title: "Bài kiểm tra lý thuyết ATLD A1",
            description: "Bài kiểm tra lý thuyết cuối khóa học ATLD A1.",
            timeLimit: 900,
            questions: [
                {
                    id: "q1",
                    content: "Khi phát hiện cháy tại nơi làm việc, bạn nên làm gì đầu tiên?",
                    options: [
                        { id: "a", content: "Báo cho quản lý hoặc gọi 114" },
                        { id: "b", content: "Tự dập lửa bằng nước" },
                        { id: "c", content: "Thu dọn đồ cá nhân" },
                        { id: "d", content: "Chạy ra ngoài mà không báo ai" },
                    ],
                    answer: "a",
                },
                {
                    id: "q2",
                    content: "Khi làm việc trên cao, thiết bị nào sau đây là bắt buộc?",
                    options: [
                        { id: "a", content: "Dây an toàn" },
                        { id: "b", content: "Áo mưa" },
                        { id: "c", content: "Găng tay len" },
                        { id: "d", content: "Nón kết" },
                    ],
                    answer: "a",
                },
                {
                    id: "q3",
                    content:
                        "Nhiệt độ cơ thể tăng cao do làm việc lâu trong môi trường nóng gọi là gì?",
                    options: [
                        { id: "a", content: "Sốc nhiệt" },
                        { id: "b", content: "Mệt mỏi" },
                        { id: "c", content: "Khát nước" },
                        { id: "d", content: "Đau đầu" },
                    ],
                    answer: "a",
                },
            ],
        },
    ],
};
