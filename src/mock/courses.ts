import { Course, CourseType, Exam, Lession, LessionType, Question } from "@/types/course";

// Mock Questions for ATLD A1
const atldA1Questions: Question[] = [
    {
        id: "q1",
        title: "Biển báo giao thông nào dưới đây là biển cấm?",
        description: "Chọn câu trả lời đúng nhất",
        options: [
            { id: "opt1", content: "Biển hình tròn viền đỏ, nền trắng" },
            { id: "opt2", content: "Biển hình vuông, nền xanh" },
            { id: "opt3", content: "Biển hình tam giác, nền vàng" },
            { id: "opt4", content: "Biển hình chữ nhật, nền xanh" },
        ],
        answer: "opt1",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
    },
    {
        id: "q2",
        title: "Khoảng cách an toàn tối thiểu giữa hai xe khi chạy trên đường cao tốc là bao nhiêu?",
        description: "Chọn câu trả lời đúng",
        options: [
            { id: "opt1", content: "20 mét" },
            { id: "opt2", content: "50 mét" },
            { id: "opt3", content: "70 mét" },
            { id: "opt4", content: "100 mét" },
        ],
        answer: "opt3",
        createdAt: "2024-01-15T10:05:00Z",
        updatedAt: "2024-01-15T10:05:00Z",
    },
    {
        id: "q3",
        title: "Người điều khiển xe mô tô có được phép sử dụng điện thoại khi đang lái xe không?",
        description: "Chọn câu trả lời đúng nhất",
        options: [
            { id: "opt1", content: "Được phép nếu sử dụng tai nghe" },
            { id: "opt2", content: "Không được phép trong mọi trường hợp" },
            { id: "opt3", content: "Được phép khi dừng đèn đỏ" },
            { id: "opt4", content: "Được phép khi đường vắng" },
        ],
        answer: "opt2",
        createdAt: "2024-01-15T10:10:00Z",
        updatedAt: "2024-01-15T10:10:00Z",
    },
    {
        id: "q4",
        title: "Nồng độ cồn tối đa cho phép khi điều khiển xe mô tô là bao nhiêu?",
        description: "Theo quy định mới nhất",
        options: [
            { id: "opt1", content: "Dưới 0.25 mg/lít khí thở" },
            { id: "opt2", content: "Dưới 0.5 mg/lít khí thở" },
            { id: "opt3", content: "0 mg/lít khí thở (không có cồn)" },
            { id: "opt4", content: "Dưới 1 mg/lít khí thở" },
        ],
        answer: "opt3",
        createdAt: "2024-01-15T10:15:00Z",
        updatedAt: "2024-01-15T10:15:00Z",
    },
    {
        id: "q5",
        title: "Khi gặp xe ưu tiên đang phát tín hiệu, người lái xe phải làm gì?",
        description: "Chọn hành động đúng nhất",
        options: [
            { id: "opt1", content: "Tiếp tục đi nếu đang đi trước" },
            { id: "opt2", content: "Giảm tốc độ, tránh sang bên và dừng lại" },
            { id: "opt3", content: "Tăng tốc để tránh khỏi xe ưu tiên" },
            { id: "opt4", content: "Bấm còi cảnh báo" },
        ],
        answer: "opt2",
        createdAt: "2024-01-15T10:20:00Z",
        updatedAt: "2024-01-15T10:20:00Z",
    },
];

// Mock Questions for ATLD A2
const atldA2Questions: Question[] = [
    {
        id: "q6",
        title: "Tốc độ tối đa cho phép đối với xe mô tô trên đường cao tốc là bao nhiêu?",
        description: "Chọn câu trả lời đúng",
        options: [
            { id: "opt1", content: "60 km/h" },
            { id: "opt2", content: "80 km/h" },
            { id: "opt3", content: "100 km/h" },
            { id: "opt4", content: "120 km/h" },
        ],
        answer: "opt3",
        createdAt: "2024-01-16T09:00:00Z",
        updatedAt: "2024-01-16T09:00:00Z",
    },
    {
        id: "q7",
        title: "Khi xe mô tô tham gia giao thông đường bộ, người lái xe phải mang theo giấy tờ gì?",
        description: "Chọn câu trả lời đầy đủ nhất",
        options: [
            { id: "opt1", content: "Giấy phép lái xe" },
            { id: "opt2", content: "Giấy đăng ký xe" },
            { id: "opt3", content: "Giấy bảo hiểm xe" },
            { id: "opt4", content: "Cả ba loại giấy tờ trên" },
        ],
        answer: "opt4",
        createdAt: "2024-01-16T09:05:00Z",
        updatedAt: "2024-01-16T09:05:00Z",
    },
    {
        id: "q8",
        title: "Trong trường hợp đặc biệt, xe được phép đi ngược chiều trên đường một chiều không?",
        description: "Chọn câu trả lời đúng",
        options: [
            { id: "opt1", content: "Được phép khi đường vắng" },
            { id: "opt2", content: "Được phép trong trường hợp khẩn cấp" },
            { id: "opt3", content: "Không được phép trong mọi trường hợp" },
            { id: "opt4", content: "Được phép nếu có xe ưu tiên dẫn đường" },
        ],
        answer: "opt3",
        createdAt: "2024-01-16T09:10:00Z",
        updatedAt: "2024-01-16T09:10:00Z",
    },
];

// Mock Questions for ATLD B1
const atldB1Questions: Question[] = [
    {
        id: "q9",
        title: "Khi điều khiển xe ô tô, người lái xe bắt buộc phải thắt dây an toàn ở vị trí nào?",
        description: "Chọn câu trả lời đúng nhất",
        options: [
            { id: "opt1", content: "Chỉ khi đi đường cao tốc" },
            { id: "opt2", content: "Tất cả các vị trí có dây an toàn" },
            { id: "opt3", content: "Chỉ ghế lái và ghế phụ trước" },
            { id: "opt4", content: "Tùy theo sở thích cá nhân" },
        ],
        answer: "opt2",
        createdAt: "2024-01-17T08:00:00Z",
        updatedAt: "2024-01-17T08:00:00Z",
    },
    {
        id: "q10",
        title: "Trong khu vực dân cư, tốc độ tối đa cho xe ô tô là bao nhiêu?",
        description: "Theo quy định hiện hành",
        options: [
            { id: "opt1", content: "30 km/h" },
            { id: "opt2", content: "40 km/h" },
            { id: "opt3", content: "50 km/h" },
            { id: "opt4", content: "60 km/h" },
        ],
        answer: "opt3",
        createdAt: "2024-01-17T08:05:00Z",
        updatedAt: "2024-01-17T08:05:00Z",
    },
];

// Mock Questions for ATLD A3
const atldA3Questions: Question[] = [
    {
        id: "q11",
        title: "Xe mô tô ba bánh được phép chở tối đa bao nhiêu người?",
        description: "Chọn câu trả lời đúng",
        options: [
            { id: "opt1", content: "2 người" },
            { id: "opt2", content: "3 người" },
            { id: "opt3", content: "4 người" },
            { id: "opt4", content: "Tùy theo thiết kế xe" },
        ],
        answer: "opt4",
        createdAt: "2024-01-18T08:00:00Z",
        updatedAt: "2024-01-18T08:00:00Z",
    },
    {
        id: "q12",
        title: "Xe mô tô ba bánh có được phép đi vào đường cao tốc không?",
        description: "Theo quy định hiện hành",
        options: [
            { id: "opt1", content: "Được phép" },
            { id: "opt2", content: "Không được phép" },
            { id: "opt3", content: "Được phép nếu có giấy phép đặc biệt" },
            { id: "opt4", content: "Được phép vào ban đêm" },
        ],
        answer: "opt2",
        createdAt: "2024-01-18T08:05:00Z",
        updatedAt: "2024-01-18T08:05:00Z",
    },
];

// Mock Questions for ATLD B2
const atldB2Questions: Question[] = [
    {
        id: "q13",
        title: "Xe ô tô trên 9 chỗ ngồi được phép chạy tốc độ tối đa bao nhiêu trên đường cao tốc?",
        description: "Chọn câu trả lời đúng",
        options: [
            { id: "opt1", content: "80 km/h" },
            { id: "opt2", content: "90 km/h" },
            { id: "opt3", content: "100 km/h" },
            { id: "opt4", content: "120 km/h" },
        ],
        answer: "opt2",
        createdAt: "2024-01-19T08:00:00Z",
        updatedAt: "2024-01-19T08:00:00Z",
    },
    {
        id: "q14",
        title: "Người lái xe B2 cần lưu ý gì khi lái xe có kích thước lớn?",
        description: "Chọn câu trả lời đầy đủ nhất",
        options: [
            { id: "opt1", content: "Điểm mù lớn hơn xe con" },
            { id: "opt2", content: "Khoảng cách phanh dài hơn" },
            { id: "opt3", content: "Bán kính vòng quay lớn hơn" },
            { id: "opt4", content: "Tất cả các ý trên" },
        ],
        answer: "opt4",
        createdAt: "2024-01-19T08:05:00Z",
        updatedAt: "2024-01-19T08:05:00Z",
    },
];

// Mock Questions for ATLD C
const atldCQuestions: Question[] = [
    {
        id: "q15",
        title: "Xe tải có trọng tải từ bao nhiêu tấn trở lên phải có phù hiệu phản quang?",
        description: "Theo quy định hiện hành",
        options: [
            { id: "opt1", content: "Từ 1 tấn" },
            { id: "opt2", content: "Từ 2 tấn" },
            { id: "opt3", content: "Từ 3.5 tấn" },
            { id: "opt4", content: "Tất cả xe tải" },
        ],
        answer: "opt3",
        createdAt: "2024-01-20T08:00:00Z",
        updatedAt: "2024-01-20T08:00:00Z",
    },
    {
        id: "q16",
        title: "Khi chở hàng, người lái xe tải cần chú ý điều gì quan trọng nhất?",
        description: "Chọn câu trả lời đúng nhất",
        options: [
            { id: "opt1", content: "Tốc độ xe" },
            { id: "opt2", content: "Trọng tải và cách xếp hàng" },
            { id: "opt3", content: "Thời gian di chuyển" },
            { id: "opt4", content: "Nhiên liệu xe" },
        ],
        answer: "opt2",
        createdAt: "2024-01-20T08:05:00Z",
        updatedAt: "2024-01-20T08:05:00Z",
    },
];

// Mock Exams
const atldA1Exam: Exam = {
    id: "exam1",
    title: "Kiểm tra ATLD A1",
    description: "Bài thi lý thuyết kiểm tra kiến thức cho bằng lái A1",
    passScore: 80,
    questions: atldA1Questions,
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
};

const atldA2Exam: Exam = {
    id: "exam2",
    title: "Kiểm tra ATLD A2",
    description: "Bài thi lý thuyết kiểm tra kiến thức cho bằng lái A2",
    passScore: 80,
    questions: atldA2Questions,
    createdAt: "2024-01-16T08:00:00Z",
    updatedAt: "2024-01-16T08:00:00Z",
};

const atldB1Exam: Exam = {
    id: "exam3",
    title: "Kiểm tra ATLD B1",
    description: "Bài thi lý thuyết kiểm tra kiến thức cho bằng lái B1",
    passScore: 80,
    questions: atldB1Questions,
    createdAt: "2024-01-17T08:00:00Z",
    updatedAt: "2024-01-17T08:00:00Z",
};

const atldA3Exam: Exam = {
    id: "exam4",
    title: "Kiểm tra ATLD A3",
    description: "Bài thi lý thuyết kiểm tra kiến thức cho bằng lái A3",
    passScore: 80,
    questions: atldA3Questions,
    createdAt: "2024-01-18T08:00:00Z",
    updatedAt: "2024-01-18T08:00:00Z",
};

const atldB2Exam: Exam = {
    id: "exam5",
    title: "Kiểm tra ATLD B2",
    description: "Bài thi lý thuyết kiểm tra kiến thức cho bằng lái B2",
    passScore: 80,
    questions: atldB2Questions,
    createdAt: "2024-01-19T08:00:00Z",
    updatedAt: "2024-01-19T08:00:00Z",
};

const atldCExam: Exam = {
    id: "exam6",
    title: "Kiểm tra ATLD C",
    description: "Bài thi lý thuyết kiểm tra kiến thức cho bằng lái C",
    passScore: 80,
    questions: atldCQuestions,
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z",
};

// Mock Lessons for ATLD A1
const atldA1Lessons: Lession[] = [
    // Theory lessons
    {
        id: "lesson1",
        courseId: "course1",
        title: "Giới thiệu về luật giao thông đường bộ",
        description: "Tìm hiểu các quy định cơ bản về giao thông đường bộ tại Việt Nam",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/a1-theory-lesson1.mp4",
        sequenceNo: 1,
    },
    {
        id: "lesson2",
        courseId: "course1",
        title: "Biển báo cấm và biển báo hiệu lệnh",
        description: "Học và nhận diện các loại biển báo cấm và hiệu lệnh",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/a1-theory-lesson2.mp4",
        sequenceNo: 2,
    },
    {
        id: "lesson3",
        courseId: "course1",
        title: "Biển báo nguy hiểm và chỉ dẫn",
        description: "Học và nhận diện biển báo nguy hiểm và biển chỉ dẫn",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/a1-theory-lesson3.mp4",
        sequenceNo: 3,
    },
    {
        id: "lesson4",
        courseId: "course1",
        title: "Quy tắc nhường đường và quyền ưu tiên",
        description: "Các quy tắc về nhường đường tại ngã tư, ngã ba",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/a1-theory-lesson4.mp4",
        sequenceNo: 4,
    },
    {
        id: "lesson5",
        courseId: "course1",
        title: "Tốc độ và khoảng cách an toàn",
        description: "Quy định về tốc độ và khoảng cách giữa các phương tiện",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/a1-theory-lesson5.mp4",
        sequenceNo: 5,
    },
    // Practice lessons
    {
        id: "lesson6",
        courseId: "course1",
        title: "Kỹ thuật khởi động và dừng xe",
        description: "Thực hành khởi động, sang số và dừng xe an toàn",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/a1-practice-lesson1.mp4",
        sequenceNo: 6,
    },
    {
        id: "lesson7",
        courseId: "course1",
        title: "Lái xe trên đường thẳng",
        description: "Thực hành điều khiển xe trên đường thẳng, giữ thân xe ổn định",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/a1-practice-lesson2.mp4",
        sequenceNo: 7,
    },
    {
        id: "lesson8",
        courseId: "course1",
        title: "Vào cua và chuyển hướng",
        description: "Kỹ thuật vào cua an toàn và chuyển hướng đúng quy định",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/a1-practice-lesson3.mp4",
        sequenceNo: 8,
    },
    {
        id: "lesson9",
        courseId: "course1",
        title: "Đỗ xe và quay đầu xe",
        description: "Thực hành đỗ xe và quay đầu xe an toàn",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/a1-practice-lesson4.mp4",
        sequenceNo: 9,
    },
];

// Mock Lessons for ATLD A2
const atldA2Lessons: Lession[] = [
    // Theory lessons
    {
        id: "lesson10",
        courseId: "course2",
        title: "Quy định về xe mô tô phân khối lớn",
        description: "Các quy định đặc thù dành cho xe mô tô có phân khối lớn",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/a2-theory-lesson1.mp4",
        sequenceNo: 1,
    },
    {
        id: "lesson11",
        courseId: "course2",
        title: "Xử lý tình huống giao thông phức tạp",
        description: "Học cách xử lý các tình huống giao thông phức tạp",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/a2-theory-lesson2.mp4",
        sequenceNo: 2,
    },
    {
        id: "lesson12",
        courseId: "course2",
        title: "Lái xe an toàn trong điều kiện đặc biệt",
        description: "Kỹ năng lái xe trong mưa, sương mù, ban đêm",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/a2-theory-lesson3.mp4",
        sequenceNo: 3,
    },
    {
        id: "lesson13",
        courseId: "course2",
        title: "Văn hóa và đạo đức giao thông",
        description: "Đạo đức và văn hóa khi tham gia giao thông",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/a2-theory-lesson4.mp4",
        sequenceNo: 4,
    },
    // Practice lessons
    {
        id: "lesson14",
        courseId: "course2",
        title: "Kỹ thuật lái xe số sàn nâng cao",
        description: "Thực hành chuyển số mượt mà và điều khiển xe chuyên nghiệp",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/a2-practice-lesson1.mp4",
        sequenceNo: 5,
    },
    {
        id: "lesson15",
        courseId: "course2",
        title: "Lái xe trong khu vực đông đúc",
        description: "Kỹ năng điều khiển xe trong khu vực đông người và xe",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/a2-practice-lesson2.mp4",
        sequenceNo: 6,
    },
    {
        id: "lesson16",
        courseId: "course2",
        title: "Lái xe trên đường cao tốc",
        description: "Thực hành lái xe trên đường cao tốc an toàn",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/a2-practice-lesson3.mp4",
        sequenceNo: 7,
    },
    {
        id: "lesson17",
        courseId: "course2",
        title: "Xử lý tình huống khẩn cấp",
        description: "Thực hành xử lý các tình huống khẩn cấp trên đường",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/a2-practice-lesson4.mp4",
        sequenceNo: 8,
    },
];

// Mock Lessons for ATLD B1
const atldB1Lessons: Lession[] = [
    // Theory lessons
    {
        id: "lesson18",
        courseId: "course3",
        title: "Quy định về điều khiển xe ô tô",
        description: "Các quy định cơ bản về điều khiển xe ô tô",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/b1-theory-lesson1.mp4",
        sequenceNo: 1,
    },
    {
        id: "lesson19",
        courseId: "course3",
        title: "Kỹ thuật lái xe số tự động và số sàn",
        description: "Học lý thuyết về cách vận hành xe số tự động và số sàn",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/b1-theory-lesson2.mp4",
        sequenceNo: 2,
    },
    {
        id: "lesson20",
        courseId: "course3",
        title: "Hệ thống an toàn trên xe ô tô",
        description: "Tìm hiểu về các hệ thống an toàn như ABS, EBD, ESP",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/b1-theory-lesson3.mp4",
        sequenceNo: 3,
    },
    {
        id: "lesson21",
        courseId: "course3",
        title: "Quy tắc lái xe trong và ngoài thành phố",
        description: "Các quy tắc khi lái xe trong khu dân cư và ngoại thành",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/b1-theory-lesson4.mp4",
        sequenceNo: 4,
    },
    {
        id: "lesson22",
        courseId: "course3",
        title: "Xử lý tình huống khi lái xe ô tô",
        description: "Các tình huống thường gặp và cách xử lý khi lái ô tô",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/b1-theory-lesson5.mp4",
        sequenceNo: 5,
    },
    // Practice lessons
    {
        id: "lesson23",
        courseId: "course3",
        title: "Khởi hành và dừng xe ô tô",
        description: "Thực hành khởi hành, phanh và dừng xe an toàn",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/b1-practice-lesson1.mp4",
        sequenceNo: 6,
    },
    {
        id: "lesson24",
        courseId: "course3",
        title: "Lùi xe và đỗ xe",
        description: "Thực hành lùi xe và đỗ xe trong các tình huống khác nhau",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/b1-practice-lesson2.mp4",
        sequenceNo: 7,
    },
    {
        id: "lesson25",
        courseId: "course3",
        title: "Vào cua và chuyển làn",
        description: "Kỹ thuật vào cua an toàn và chuyển làn đúng quy định",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/b1-practice-lesson3.mp4",
        sequenceNo: 8,
    },
    {
        id: "lesson26",
        courseId: "course3",
        title: "Lái xe trong khu vực đông xe",
        description: "Thực hành lái xe trong môi trường giao thông đông đúc",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/b1-practice-lesson4.mp4",
        sequenceNo: 9,
    },
    {
        id: "lesson27",
        courseId: "course3",
        title: "Thi sa hình",
        description: "Thực hành các bài thi sa hình theo quy định",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/b1-practice-lesson5.mp4",
        sequenceNo: 10,
    },
];

// Mock Lessons for ATLD A3
const atldA3Lessons: Lession[] = [
    // Theory lessons
    {
        id: "lesson28",
        courseId: "course4",
        title: "Đặc điểm xe mô tô ba bánh",
        description: "Tìm hiểu đặc điểm và cấu tạo xe mô tô ba bánh",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/a3-theory-lesson1.mp4",
        sequenceNo: 1,
    },
    {
        id: "lesson29",
        courseId: "course4",
        title: "Quy định về xe mô tô ba bánh",
        description: "Các quy định pháp luật dành cho xe mô tô ba bánh",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/a3-theory-lesson2.mp4",
        sequenceNo: 2,
    },
    {
        id: "lesson30",
        courseId: "course4",
        title: "An toàn khi điều khiển xe ba bánh",
        description: "Các nguyên tắc an toàn đặc thù cho xe ba bánh",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/a3-theory-lesson3.mp4",
        sequenceNo: 3,
    },
    {
        id: "lesson31",
        courseId: "course4",
        title: "Bảo dưỡng xe mô tô ba bánh",
        description: "Hướng dẫn bảo dưỡng và kiểm tra xe ba bánh",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/a3-theory-lesson4.mp4",
        sequenceNo: 4,
    },
    // Practice lessons
    {
        id: "lesson32",
        courseId: "course4",
        title: "Khởi động và điều khiển xe ba bánh",
        description: "Thực hành khởi động và vận hành xe ba bánh cơ bản",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/a3-practice-lesson1.mp4",
        sequenceNo: 5,
    },
    {
        id: "lesson33",
        courseId: "course4",
        title: "Kỹ thuật cân bằng xe ba bánh",
        description: "Thực hành giữ thân xe ổn định khi vào cua",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/a3-practice-lesson2.mp4",
        sequenceNo: 6,
    },
    {
        id: "lesson34",
        courseId: "course4",
        title: "Lái xe ba bánh trong khu dân cư",
        description: "Thực hành lái xe ba bánh trong khu vực đông người",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/a3-practice-lesson3.mp4",
        sequenceNo: 7,
    },
];

// Mock Lessons for ATLD B2
const atldB2Lessons: Lession[] = [
    // Theory lessons
    {
        id: "lesson35",
        courseId: "course5",
        title: "Đặc điểm xe ô tô trên 9 chỗ",
        description: "Tìm hiểu về đặc điểm và cấu tạo xe ô tô lớn",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/b2-theory-lesson1.mp4",
        sequenceNo: 1,
    },
    {
        id: "lesson36",
        courseId: "course5",
        title: "Quy định về xe ô tô trên 9 chỗ",
        description: "Các quy định pháp luật dành cho xe lớn",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/b2-theory-lesson2.mp4",
        sequenceNo: 2,
    },
    {
        id: "lesson37",
        courseId: "course5",
        title: "Điểm mù và kỹ thuật quan sát",
        description: "Hiểu về điểm mù và cách quan sát khi lái xe lớn",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/b2-theory-lesson3.mp4",
        sequenceNo: 3,
    },
    {
        id: "lesson38",
        courseId: "course5",
        title: "An toàn khi chở khách",
        description: "Các nguyên tắc an toàn khi vận chuyển hành khách",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/b2-theory-lesson4.mp4",
        sequenceNo: 4,
    },
    {
        id: "lesson39",
        courseId: "course5",
        title: "Xử lý tình huống khẩn cấp với xe lớn",
        description: "Kỹ năng xử lý tình huống đặc biệt khi lái xe lớn",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/b2-theory-lesson5.mp4",
        sequenceNo: 5,
    },
    // Practice lessons
    {
        id: "lesson40",
        courseId: "course5",
        title: "Khởi hành và dừng xe B2",
        description: "Thực hành khởi hành và dừng xe ô tô trên 9 chỗ",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/b2-practice-lesson1.mp4",
        sequenceNo: 6,
    },
    {
        id: "lesson41",
        courseId: "course5",
        title: "Lùi xe và đỗ xe B2",
        description: "Kỹ thuật lùi và đỗ xe lớn an toàn",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/b2-practice-lesson2.mp4",
        sequenceNo: 7,
    },
    {
        id: "lesson42",
        courseId: "course5",
        title: "Vào cua với xe B2",
        description: "Thực hành vào cua với bán kính lớn",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/b2-practice-lesson3.mp4",
        sequenceNo: 8,
    },
    {
        id: "lesson43",
        courseId: "course5",
        title: "Lái xe B2 trong đô thị",
        description: "Kỹ năng lái xe lớn trong môi trường đô thị",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/b2-practice-lesson4.mp4",
        sequenceNo: 9,
    },
];

// Mock Lessons for ATLD C
const atldCLessons: Lession[] = [
    // Theory lessons
    {
        id: "lesson44",
        courseId: "course6",
        title: "Đặc điểm xe tải",
        description: "Tìm hiểu về đặc điểm, cấu tạo và phân loại xe tải",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/c-theory-lesson1.mp4",
        sequenceNo: 1,
    },
    {
        id: "lesson45",
        courseId: "course6",
        title: "Quy định về xe tải và chở hàng",
        description: "Các quy định pháp luật về xe tải và vận chuyển hàng hóa",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/c-theory-lesson2.mp4",
        sequenceNo: 2,
    },
    {
        id: "lesson46",
        courseId: "course6",
        title: "Trọng tải và phân bổ tải trọng",
        description: "Hiểu về trọng tải và cách phân bổ tải trọng an toàn",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/c-theory-lesson3.mp4",
        sequenceNo: 3,
    },
    {
        id: "lesson47",
        courseId: "course6",
        title: "Hệ thống phanh xe tải",
        description: "Tìm hiểu về hệ thống phanh khí nén và phanh dầu",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/c-theory-lesson4.mp4",
        sequenceNo: 4,
    },
    {
        id: "lesson48",
        courseId: "course6",
        title: "An toàn khi chở hàng",
        description: "Các nguyên tắc an toàn khi vận chuyển hàng hóa",
        type: LessionType.THEORY,
        videoUrl: "https://example.com/videos/c-theory-lesson5.mp4",
        sequenceNo: 5,
    },
    // Practice lessons
    {
        id: "lesson49",
        courseId: "course6",
        title: "Khởi động và điều khiển xe tải",
        description: "Thực hành khởi động và vận hành xe tải cơ bản",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/c-practice-lesson1.mp4",
        sequenceNo: 6,
    },
    {
        id: "lesson50",
        courseId: "course6",
        title: "Lùi xe tải",
        description: "Kỹ thuật lùi xe tải an toàn với quan sát gương",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/c-practice-lesson2.mp4",
        sequenceNo: 7,
    },
    {
        id: "lesson51",
        courseId: "course6",
        title: "Vào cua và chuyển làn với xe tải",
        description: "Thực hành vào cua và chuyển làn an toàn",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/c-practice-lesson3.mp4",
        sequenceNo: 8,
    },
    {
        id: "lesson52",
        courseId: "course6",
        title: "Lái xe tải trên đường dốc",
        description: "Kỹ thuật lái xe trên đường dốc lên và dốc xuống",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/c-practice-lesson4.mp4",
        sequenceNo: 9,
    },
    {
        id: "lesson53",
        courseId: "course6",
        title: "Xử lý tình huống với xe có tải",
        description: "Thực hành xử lý tình huống khi xe chở hàng",
        type: LessionType.PRACTICE,
        videoUrl: "https://example.com/videos/c-practice-lesson5.mp4",
        sequenceNo: 10,
    },
];

// Mock Courses - All ATLD type
export const mockCourses: Course[] = [
    {
        id: "course1",
        title: "ATLD - Bằng lái A1",
        description:
            "Khóa học đầy đủ lý thuyết và thực hành cho bằng lái xe mô tô hạng A1. Bao gồm các kiến thức về luật giao thông, biển báo, quy tắc an toàn và kỹ năng lái xe cơ bản.",
        type: CourseType.ATLD,
        lessons: atldA1Lessons,
        examId: "exam1",
        createdAt: "2024-01-10T08:00:00Z",
        updatedAt: "2024-01-20T10:00:00Z",
    },
    {
        id: "course2",
        title: "ATLD - Bằng lái A2",
        description:
            "Khóa học đầy đủ lý thuyết và thực hành cho bằng lái xe mô tô hạng A2. Dành cho xe mô tô phân khối lớn với kiến thức nâng cao về xử lý tình huống và kỹ năng lái xe chuyên nghiệp.",
        type: CourseType.ATLD,
        lessons: atldA2Lessons,
        examId: "exam2",
        createdAt: "2024-01-12T08:00:00Z",
        updatedAt: "2024-01-22T10:00:00Z",
    },
    {
        id: "course3",
        title: "ATLD - Bằng lái B1",
        description:
            "Khóa học đầy đủ lý thuyết và thực hành cho bằng lái xe ô tô hạng B1. Bao gồm kiến thức về luật giao thông, biển báo, kỹ thuật lái xe ô tô và các bài thi sa hình.",
        type: CourseType.ATLD,
        lessons: atldB1Lessons,
        examId: "exam3",
        createdAt: "2024-01-15T08:00:00Z",
        updatedAt: "2024-01-25T10:00:00Z",
    },
    {
        id: "course4",
        title: "ATLD - Bằng lái A3",
        description:
            "Khóa học đầy đủ lý thuyết và thực hành cho bằng lái xe mô tô ba bánh hạng A3. Học viên sẽ được trang bị kiến thức và kỹ năng điều khiển xe ba bánh an toàn.",
        type: CourseType.ATLD,
        lessons: atldA3Lessons,
        examId: "exam4",
        createdAt: "2024-01-18T08:00:00Z",
        updatedAt: "2024-01-28T10:00:00Z",
    },
    {
        id: "course5",
        title: "ATLD - Bằng lái B2",
        description:
            "Khóa học đầy đủ lý thuyết và thực hành cho bằng lái xe ô tô hạng B2. Dành cho xe ô tô trên 9 chỗ ngồi với các kỹ năng lái xe chuyên nghiệp và an toàn.",
        type: CourseType.ATLD,
        lessons: atldB2Lessons,
        examId: "exam5",
        createdAt: "2024-01-19T08:00:00Z",
        updatedAt: "2024-01-29T10:00:00Z",
    },
    {
        id: "course6",
        title: "ATLD - Bằng lái C",
        description:
            "Khóa học đầy đủ lý thuyết và thực hành cho bằng lái xe tải hạng C. Bao gồm kiến thức về vận chuyển hàng hóa, trọng tải, và kỹ thuật lái xe tải an toàn.",
        type: CourseType.ATLD,
        lessons: atldCLessons,
        examId: "exam6",
        createdAt: "2024-01-20T08:00:00Z",
        updatedAt: "2024-01-30T10:00:00Z",
    },
];

// Export individual items if needed
export const mockExams: Exam[] = [
    atldA1Exam,
    atldA2Exam,
    atldB1Exam,
    atldA3Exam,
    atldB2Exam,
    atldCExam,
];
export const mockQuestions: Question[] = [
    ...atldA1Questions,
    ...atldA2Questions,
    ...atldB1Questions,
    ...atldA3Questions,
    ...atldB2Questions,
    ...atldCQuestions,
];
