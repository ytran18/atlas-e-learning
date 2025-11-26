# ATLD E-Learning Platform

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng chính](#tính-năng-chính)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Scripts](#scripts)
- [Kiến trúc Code](#kiến-trúc-code)
- [Code Conventions](#code-conventions)
- [Cấu trúc Folder](#cấu-trúc-folder)
- [Git Workflow](#git-workflow)
- [Quy tắc Commit](#quy-tắc-commit)
- [Linting & Formatting](#linting--formatting)

---

## 🎯 Giới thiệu

**ATLD E-Learning** là nền tảng học trực tuyến hiện đại, cung cấp trải nghiệm học tập toàn diện thông qua các khóa học video và tài liệu chất lượng cao. Dự án được xây dựng với mục tiêu tối ưu hóa trải nghiệm người dùng, hiệu suất cao và dễ dàng mở rộng.

Project sử dụng **Next.js 15**, **React 19**, và **TypeScript** với kiến trúc phân tách rõ ràng giữa Presentation Components và Composition Components.

### Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4, Mantine UI 8
- **State Management**: React Query (TanStack Query) v5
- **Authentication**: Clerk
- **Database & Backend**: Firebase Admin (Firestore)
- **Search Engine**: Algolia
- **Cloud Storage**: Cloudflare R2 (AWS S3 compatible)
- **Video Player**: React Player, HLS.js
- **Analytics**: Mixpanel, Vercel Speed Insights
- **Code Quality**: ESLint, Prettier, Commitlint, Husky

---

## 🌟 Tính năng chính

### 1. Authentication (Xác thực)

- Đăng ký/Đăng nhập người dùng qua Clerk.
- Quản lý session và bảo mật route.

### 2. Courses (Khóa học)

- Danh sách khóa học với bộ lọc và tìm kiếm.
- Giao diện học tập (Learning Dashboard) trực quan.
- Theo dõi tiến độ học tập.

### 3. Documents (Tài liệu)

- Thư viện tài liệu và video tham khảo.
- Tích hợp tìm kiếm nhanh với Algolia.
- Phân loại tài liệu theo định dạng (File/Video).

### 4. Admin Portal (Quản trị)

- Dashboard quản lý tổng quan.
- Quản lý người dùng (Users).
- Quản lý khóa học (Courses): Tạo, sửa, xóa, sắp xếp bài học.
- Quản lý tài liệu (Documents): Upload file, video, đồng bộ Algolia.

### 5. User Profile

- Thông tin cá nhân.
- Lịch sử học tập.

---

## 💻 Yêu cầu hệ thống

- **Node.js**: 20.16.0 (xem file `.nvmrc`)
- **Package Manager**: npm 10.2.4+

---

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd atld-e-learning
```

### 2. Cài đặt Node version đúng

```bash
nvm use
# hoặc
nvm install
```

### 3. Cài đặt dependencies

```bash
npm install
```

### 4. Cấu hình biến môi trường

```bash
# Copy file env example
cp env.example .env.local

# Sau đó thêm các API keys cần thiết vào .env.local
```

**Lưu ý**: Xem chi tiết về cấu hình Clerk Authentication trong file [`CLERK_SETUP.md`](./CLERK_SETUP.md)

### 5. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

---

## 📜 Scripts

### Development

```bash
npm run dev              # Chạy dev server với Turbopack
npm run build            # Build production
npm run start            # Chạy production server
```

### Code Quality

```bash
npm run lint             # Check linting errors
npm run lint:fix         # Auto fix linting errors
npm run type-check       # Check TypeScript types
npm run format           # Format toàn bộ code với Prettier
npm run format:check     # Check format without changing files
```

---

## 🏗️ Kiến trúc Code

Project sử dụng kiến trúc **Composition Pattern** với 2 loại components chính:

### 1. Presentation Components (UI Components)

**Đặc điểm:**

- 📍 **Location**: Folder `_components` trong mỗi feature
- 🎨 **Mục đích**: Chỉ tập trung vào hiển thị UI
- ❌ **Không được**: Fetch data, chứa business logic
- ✅ **Nên**: Stateless hoặc minimal state, reusable, dễ test
- 🔧 **Props**: Nhận data qua props, emit events lên parent

### 2. Composition Components (Smart Components / Widgets)

**Đặc điểm:**

- 📍 **Location**: Folder `_widgets` trong mỗi feature
- 🧠 **Mục đích**: Xử lý business logic, data fetching, state management
- ✅ **Có thể**: Fetch data, manage state, handle side effects
- 🔄 **Pattern**: Wrap Presentation Components và truyền data xuống
- 🎯 **Context**: Sử dụng React Context để share data

---

## 📐 Code Conventions

### Naming Conventions

- **Files & Folders**: `camelCase`
- **Components**: `PascalCase` (function name)
- **Variables & Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types & Interfaces**: `PascalCase`

### Best Practices

1. **DRY (Don't Repeat Yourself)**: Tránh duplicate code.
2. **Single Responsibility**: Mỗi function/component chỉ làm 1 việc.
3. **Clear Separation**: Tách biệt UI logic và business logic.
4. **Type Safety**: Luôn define types/interfaces rõ ràng.

---

## 📁 Cấu trúc Folder

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── provider.tsx       # Global providers
│   └── globals.css        # Global styles
│
├── features/              # Feature-based organization
│   ├── auth/              # Authentication feature
│   ├── course/            # Course management & learning
│   ├── docs/              # Document library
│   ├── landing-page/      # Landing page components
│   ├── quan-tri/          # Admin portal (Quản trị)
│   └── users/             # User management
│       ├── _components/   # Presentation Components
│       ├── _widgets/      # Composition Components
│       ├── hooks/         # Feature-specific hooks
│       ├── types/         # Feature-specific types
│       └── utils/         # Feature-specific utilities
│
├── components/            # Shared/Common components
│   ├── ui/               # Shared UI components
│   └── layouts/          # Shared layouts
│
├── hooks/                # Shared hooks
├── libs/                 # External libraries integration (Firebase, Algolia, etc.)
├── services/             # API services & Business logic
├── types/                # Shared TypeScript types
└── utils/                # Shared utilities
```

---

## 🔀 Git Workflow

### Branching Strategy

- **`master`**: Production branch (protected)
- **`develop`**: Development branch
- **`feat/*`**: Feature branches
- **`fix/*`**: Bug fix branches

### Workflow

1. Checkout `develop`.
2. Tạo branch mới: `git checkout -b feat/feature-name`.
3. Commit changes (theo Conventional Commits).
4. Push và tạo Pull Request vào `develop`.

---

## 📝 Quy tắc Commit

Project sử dụng **Conventional Commits**:

```
<type>: <subject>
```

**Types phổ biến:**

- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Tài liệu
- `style`: Formatting
- `refactor`: Tối ưu code
- `chore`: Thay đổi cấu hình, tool

**Ví dụ:**

```bash
git commit -m "feat: add course enrollment feature"
git commit -m "fix: resolve payment calculation error"
```

---

## 🎨 Linting & Formatting

Hệ thống tự động chạy các kiểm tra khi commit (pre-commit hooks):

1. **Lint-staged**: Format & fix code đã staged.
2. **ESLint**: Check linting errors.
3. **Type Check**: Check TypeScript types.
4. **Commitlint**: Validate commit message.

---

## 📄 License

Private project - All rights reserved.
