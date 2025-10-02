# ATLD E-Learning Platform

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
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

ATLD E-Learning là nền tảng học trực tuyến được xây dựng bằng Next.js 15, React 19, và TypeScript. Project sử dụng kiến trúc phân tách rõ ràng giữa Presentation Components và Composition Components để đảm bảo code dễ bảo trì và mở rộng.

### Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **React**: 19.1.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4
- **Analytics**: Mixpanel, Vercel Speed Insights
- **Code Quality**: ESLint, Prettier, Commitlint, Husky

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

### 4. Chạy development server

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

**Ví dụ:**

```tsx
// src/features/course/_components/courseCard.tsx

interface CourseCardProps {
    title: string;
    description: string;
    thumbnail: string;
    onEnroll: () => void;
}

export function CourseCard({ title, description, thumbnail, onEnroll }: CourseCardProps) {
    return (
        <div className="card">
            <img src={thumbnail} alt={title} />
            <h3>{title}</h3>
            <p>{description}</p>
            <button onClick={onEnroll}>Enroll Now</button>
        </div>
    );
}
```

### 2. Composition Components (Smart Components / Widgets)

**Đặc điểm:**

- 📍 **Location**: Folder `_widgets` trong mỗi feature
- 🧠 **Mục đích**: Xử lý business logic, data fetching, state management
- ✅ **Có thể**: Fetch data, manage state, handle side effects
- 🔄 **Pattern**: Wrap Presentation Components và truyền data xuống
- 🎯 **Context**: Sử dụng React Context để share data

**Ví dụ:**

```tsx
// src/features/course/_widgets/courseList.tsx
import { useCourses } from "@/hooks/useCourses";

import { CourseCard } from "../_components/courseCard";

export function CourseList() {
    const { courses, isLoading, enrollCourse } = useCourses();

    if (isLoading) return <Loading />;

    return (
        <div className="grid">
            {courses.map((course) => (
                <CourseCard
                    key={course.id}
                    title={course.title}
                    description={course.description}
                    thumbnail={course.thumbnail}
                    onEnroll={() => enrollCourse(course.id)}
                />
            ))}
        </div>
    );
}
```

### 3. React Context Pattern

Sử dụng Context để tránh props drilling:

```tsx
// src/features/course/_widgets/courseProvider.tsx
import { ReactNode, createContext, useContext } from "react";

interface CourseContextValue {
    courses: Course[];
    selectedCourse: Course | null;
    selectCourse: (id: string) => void;
}

const CourseContext = createContext<CourseContextValue | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
    // Business logic here
    const value = {
        /* ... */
    };

    return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourseContext() {
    const context = useContext(CourseContext);
    if (!context) throw new Error("useCourseContext must be used within CourseProvider");
    return context;
}
```

---

## 📐 Code Conventions

### Naming Conventions

- **Files & Folders**: `camelCase`
- **Components**: `PascalCase` (function name)
- **Variables & Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types & Interfaces**: `PascalCase`

### Variables

```tsx
// ✅ Đúng
const userName = "John";
const isLoading = false;

// ❌ Sai
var user_name = "John"; // Không dùng var và snake_case
let IsLoading = false; // Không dùng PascalCase cho variables
```

### Functions

- **Ưu tiên**: Pure functions (không side effects)
- **Sử dụng**: `const` thay vì `let`, tránh `var`
- **Đơn giản**: Tránh function quá dài, chia nhỏ thành các functions nhỏ hơn

```tsx
// ✅ Đúng - Pure function
const calculateTotal = (price: number, quantity: number): number => {
    return price * quantity;
};

// ❌ Sai - Impure function with side effects
let total = 0;
const calculateTotal = (price: number, quantity: number) => {
    total = price * quantity; // Side effect
};
```

### Components

- **Type**: Chỉ dùng Functional Components (không Class Components)
- **Hooks**: Sử dụng React Hooks
- **Composition**: Ưu tiên Composition over Inheritance
- **Size**: Giữ components nhỏ gọn, focused (1 responsibility)

```tsx
// ✅ Đúng - Functional component with hooks
export function UserProfile({ userId }: { userId: string }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUser(userId).then(setUser);
    }, [userId]);

    return <div>{user?.name}</div>;
}
```

### Comments

- **Tối thiểu**: Chỉ viết comment khi logic không rõ ràng
- **Meaningful**: Comment phải có ý nghĩa, giải thích "why" không phải "what"

```tsx
// ✅ Đúng - Giải thích why
// Delay 100ms để debounce user input và tránh spam API
const debouncedSearch = debounce(handleSearch, 100);

// ❌ Sai - Comment không cần thiết
// Assign name to userName variable
const userName = user.name;
```

### Best Practices

1. **DRY (Don't Repeat Yourself)**: Tránh duplicate code, nhưng không abstract quá sớm
2. **Single Responsibility**: Mỗi function/component chỉ làm 1 việc
3. **Clear Separation**: Tách biệt UI logic và business logic
4. **Type Safety**: Luôn define types/interfaces rõ ràng
5. **Maintainability**: Code phải dễ đọc, dễ maintain hơn là "clever"

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
│   └── [feature-name]/
│       ├── _components/   # Presentation Components (UI only)
│       │   ├── button.tsx
│       │   └── card.tsx
│       │
│       ├── _widgets/      # Composition Components (Smart)
│       │   ├── featureProvider.tsx
│       │   └── featureList.tsx
│       │
│       ├── hooks/         # Feature-specific hooks
│       ├── types/         # Feature-specific types
│       └── utils/         # Feature-specific utilities
│
├── components/            # Shared/Common components
│   ├── ui/               # Shared UI components
│   └── layouts/          # Shared layouts
│
├── hooks/                # Shared hooks
├── libs/                 # External libraries integration
│   ├── mixpanel/
│   └── cloudflare/
│
├── types/                # Shared TypeScript types
└── utils/                # Shared utilities
```

### Quy tắc đặt tên folder

- **`_components`**: Prefix `_` để đánh dấu đây là internal folder
- **`_widgets`**: Prefix `_` để phân biệt với public exports
- **Features**: Tên feature nên là noun (danh từ): `user`, `course`, `payment`
- **Consistency**: Giữ consistent naming trong toàn bộ project

---

## 🔀 Git Workflow

### Branching Strategy

- **`master`**: Production branch (protected)
- **`develop`**: Development branch
- **`feat/*`**: Feature branches
- **`fix/*`**: Bug fix branches
- **`chore/*`**: Maintenance branches

### Workflow

1. Tạo branch từ `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feat/feature-name
```

2. Code và commit (xem [Quy tắc Commit](#quy-tắc-commit))
3. Push và tạo Pull Request:

```bash
git push origin feat/feature-name
```

4. Review và merge vào `develop`
5. Deploy từ `develop` → `master`

---

## 📝 Quy tắc Commit

Project sử dụng **Conventional Commits** format:

### Format

```
<type>: <subject>

[optional body]

[optional footer]
```

### Types

| Type       | Mô tả                                          | Ví dụ                                    |
| ---------- | ---------------------------------------------- | ---------------------------------------- |
| `feat`     | Tính năng mới                                  | `feat: add user authentication`          |
| `fix`      | Bug fix                                        | `fix: resolve login redirect issue`      |
| `docs`     | Thay đổi documentation                         | `docs: update README with setup guide`   |
| `style`    | Format code (không ảnh hưởng logic)            | `style: format with prettier`            |
| `refactor` | Refactor code (không thay đổi functionality)   | `refactor: simplify auth logic`          |
| `perf`     | Performance improvements                       | `perf: optimize image loading`           |
| `test`     | Thêm hoặc sửa tests                            | `test: add unit tests for auth service`  |
| `build`    | Thay đổi build system hoặc dependencies        | `build: upgrade next to v15`             |
| `ci`       | Thay đổi CI configuration                      | `ci: add github actions workflow`        |
| `chore`    | Các thay đổi khác (không modify src hoặc test) | `chore: update gitignore`                |
| `revert`   | Revert commit trước                            | `revert: revert "feat: add new feature"` |

### Rules

- ✅ Type phải viết **lowercase**
- ✅ Subject không được **để trống**
- ✅ Subject không kết thúc bằng **dấu chấm (.)**
- ✅ Max length: **100 ký tự**

### Ví dụ

```bash
# ✅ Đúng
git commit -m "feat: add course enrollment feature"
git commit -m "fix: resolve payment calculation error"
git commit -m "docs: add API documentation"

# ❌ Sai
git commit -m "Add feature"              # Missing type
git commit -m "FEAT: add feature"        # Type phải lowercase
git commit -m "feat: add feature."       # Không dùng dấu chấm
git commit -m "feat:"                    # Subject trống
```

### Pre-commit Checks

Mỗi khi commit, hệ thống tự động chạy:

1. ✅ **Lint-staged**: Format & fix code đã staged
2. ✅ **ESLint**: Check linting errors trong toàn project
3. ✅ **Type Check**: Check TypeScript type errors
4. ✅ **Commitlint**: Validate commit message format

Nếu có lỗi, commit sẽ bị **reject** và bạn cần fix trước khi commit lại.

---

## 🎨 Linting & Formatting

### ESLint

- **Config**: `eslint.config.mjs`
- **Rules**: Next.js recommended + TypeScript + Prettier integration
- **Auto-fix**: Chạy `npm run lint:fix`

### Prettier

- **Config**: `.prettierrc`
- **Tab Width**: 4 spaces
- **Format on Save**: Enabled (VS Code)
- **Import Sorting**: Auto sort imports theo thứ tự:
    1. React
    2. Next.js
    3. Third-party modules
    4. Internal imports (`@/...`)
    5. Relative imports (`./...`)

### VS Code Settings

File `.vscode/settings.json` đã được cấu hình sẵn:

- ✅ Format on save
- ✅ Auto fix ESLint errors
- ✅ Tab size = 4
- ✅ Prettier as default formatter

### Husky Git Hooks

**Pre-commit**:

- Lint và format staged files
- Check ESLint errors
- Check TypeScript types

**Commit-msg**:

- Validate commit message format

---

## 🤝 Contributing

1. Đọc kỹ document này trước khi code
2. Follow tất cả conventions đã định nghĩa
3. Viết code clean, maintainable
4. Test kỹ trước khi commit
5. Tạo Pull Request với mô tả rõ ràng

---

## 📞 Support

Nếu có thắc mắc hoặc cần support, vui lòng liên hệ team lead hoặc tạo issue trong project.

---

## 📄 License

Private project - All rights reserved.
