# Authentication Feature

## Tổng quan

Feature authentication đơn giản dành cho người lao động, cho phép đăng ký và đăng nhập chỉ với **CCCD** và **Ngày sinh**.

## Cấu trúc thư mục

```
auth/
├── _components/          # Presentation Components (UI thuần túy)
│   ├── signUpFormField.tsx      # Input field component cho sign up
│   ├── signUpFormLayout.tsx     # Layout wrapper cho sign up form
│   ├── signInFormField.tsx      # Input field component cho sign in
│   └── signInFormLayout.tsx     # Layout wrapper cho sign in form
├── _widgets/             # Composition Components (Business logic)
│   ├── signUpForm.tsx           # Sign up form với logic đăng ký
│   └── signInForm.tsx           # Sign in form với logic đăng nhập
├── pages/                # Page components
│   ├── SignUp/index.tsx
│   └── SignIn/index.tsx
└── README.md
```

## Cách hoạt động

### Đăng ký (Sign Up)

1. Người dùng nhập:
    - Họ và tên (bắt buộc)
    - Ngày sinh (bắt buộc)
    - CCCD 12 số (bắt buộc)
    - Tên công ty (không bắt buộc)

2. System tạo:
    - Username: `CC` + CCCD (ví dụ: `CC012345678901`)
    - Password: `ngày_sinh_CCCD` (ví dụ: `1990-01-01_012345678901`)
    - Lưu thông tin user vào `unsafeMetadata`

### Đăng nhập (Sign In)

1. Người dùng chỉ cần nhập:
    - CCCD (12 số)
    - Ngày sinh

2. System tự động:
    - Tạo username từ CCCD
    - Tạo password từ ngày sinh + CCCD
    - Verify và tạo session

## Luồng tương tác với Clerk

### 🔹 Flow Đăng ký (Sign Up)

```mermaid
User Input → signUpForm.tsx → Clerk API → Database → Session Active → Redirect
```

**Chi tiết từng bước:**

1. **User nhập form và submit**

    ```tsx
    const [formData, setFormData] = useState({
        fullName: "",
        birthDate: "",
        cccd: "",
        companyName: "",
    });
    ```

2. **Validation phía client**
    - Kiểm tra required fields (fullName, birthDate, cccd)
    - Validate CCCD phải là 12 số: `!/^\d{12}$/.test(formData.cccd)`

3. **Tương tác với Clerk API**

    ```tsx
    const { signUp, setActive } = useSignUp();

    // Gọi Clerk API để tạo user mới
    const result = await signUp.create({
        username: `CC${formData.cccd}`, // CC012345678901
        password: `${formData.birthDate}_${formData.cccd}`, // 1990-01-01_012345678901
        unsafeMetadata: {
            fullName: formData.fullName,
            birthDate: formData.birthDate,
            cccd: formData.cccd,
            companyName: formData.companyName,
        },
    });
    ```

4. **Clerk xử lý request**
    - Kiểm tra username có tồn tại chưa
    - Hash password
    - Tạo user record trong Clerk database
    - Lưu metadata
    - Trả về `result.status === "complete"`

5. **Activate session**

    ```tsx
    if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/home");
    }
    ```

6. **Clerk tạo session**
    - Tạo session token (JWT)
    - Set cookie trong browser
    - User được authenticated

### 🔹 Flow Đăng nhập (Sign In)

```mermaid
User Input → signInForm.tsx → Clerk API → Verify → Session Active → Redirect
```

**Chi tiết từng bước:**

1. **User nhập CCCD và ngày sinh**

    ```tsx
    const [formData, setFormData] = useState({
        cccd: "",
        birthDate: "",
    });
    ```

2. **Validation phía client**
    - Kiểm tra required fields
    - Validate CCCD format

3. **Tương tác với Clerk API**

    ```tsx
    const { signIn, setActive } = useSignIn();

    const password = `${formData.birthDate}_${formData.cccd}`;

    // Gọi Clerk API để authenticate
    const result = await signIn.create({
        identifier: `CC${formData.cccd}`, // Username
        password: password, // Password đã hash
    });
    ```

4. **Clerk verify credentials**
    - Tìm user với username = `CC${cccd}`
    - So sánh password hash
    - Verify thành công → trả về session

5. **Activate session**

    ```tsx
    if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/home");
    }
    ```

6. **User được authenticated**
    - Session token stored in cookie
    - Middleware sẽ protect các routes
    - User có thể access `/home` và các protected routes

### 🔹 Clerk Hooks sử dụng

1. **`useSignUp()`**
    - `signUp.create()` - Tạo user mới
    - `isLoaded` - Check Clerk đã load xong chưa
    - `setActive()` - Activate session sau khi đăng ký

2. **`useSignIn()`**
    - `signIn.create()` - Authenticate user
    - `isLoaded` - Check Clerk đã load xong chưa
    - `setActive()` - Activate session sau khi đăng nhập

3. **`useUser()` (dùng sau khi đăng nhập)**

    ```tsx
    const { user } = useUser();

    // Truy cập thông tin user
    user.username; // "CC012345678901"
    user.unsafeMetadata.fullName; // "Nguyễn Văn A"
    user.unsafeMetadata.birthDate; // "1990-01-01"
    user.unsafeMetadata.cccd; // "012345678901"
    user.unsafeMetadata.companyName; // "Công ty ABC"
    ```

### 🔹 Error Handling

**Đăng ký:**

- Username đã tồn tại → "CCCD này đã được đăng ký"
- Invalid format → Parse error messages từ Clerk
- Network error → "Đăng ký thất bại. Vui lòng thử lại."

**Đăng nhập:**

- Sai CCCD hoặc ngày sinh → "CCCD hoặc ngày sinh không đúng"
- User không tồn tại → Same error message (security)
- Network error → Generic error message

### 🔹 Security Notes

1. **Password = birthDate + CCCD**
    - Đảm bảo phải có cả 2 thông tin đúng
    - User không cần nhớ password riêng
    - Đủ an toàn cho web học bài miễn phí

2. **Clerk handles:**
    - Password hashing (bcrypt/argon2)
    - Session management (JWT tokens)
    - CSRF protection
    - Rate limiting

3. **Middleware protection:**
    ```tsx
    // src/middleware.ts
    export default clerkMiddleware();
    // Tự động protect routes dựa trên session
    ```

## Lý do thiết kế này

✅ **Đơn giản cho người lao động**: Không cần email, không cần OTP
✅ **Đủ an toàn cho web học bài miễn phí**: Không có thông tin nhạy cảm
✅ **Dễ nhớ**: Chỉ cần CCCD và ngày sinh (thông tin quen thuộc)
✅ **Không phức tạp**: Tránh công nghệ xa lạ với đối tượng người dùng

## Lưu ý bảo mật

- Password = `birthDate_CCCD` để đảm bảo cả 2 thông tin đều phải đúng
- Sử dụng Clerk để quản lý authentication an toàn
- CCCD phải là 12 số chính xác
- Mỗi CCCD chỉ đăng ký được 1 lần

## Sử dụng

### Trong route pages:

```tsx
import SignUp from "@/features/auth/pages/SignUp";
import SignIn from "@/features/auth/pages/SignIn";

// Đăng ký
<SignUp />

// Đăng nhập
<SignIn />
```

### Truy cập thông tin user:

```tsx
import { useUser } from "@clerk/nextjs";

const { user } = useUser();
const fullName = user?.unsafeMetadata?.fullName;
const birthDate = user?.unsafeMetadata?.birthDate;
const cccd = user?.unsafeMetadata?.cccd;
const companyName = user?.unsafeMetadata?.companyName;
```

## Thiết kế UI

- Gradient background (blue-50 to gray-50)
- Card-based form với shadow
- AGK logo placeholder
- Responsive design
- Loading states
- Error messages tiếng Việt
- Link giữa Sign Up và Sign In
