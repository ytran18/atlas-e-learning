# CAPTCHA Configuration for Custom Authentication

## ⚠️ Warning đã fix

```
Cannot initialize Smart CAPTCHA widget because the `clerk-captcha` DOM element was not found
```

## ✅ Đã thêm CAPTCHA element

Đã thêm `<div id="clerk-captcha" />` vào cả 2 form:

- `signUpForm.tsx` - Line 143
- `signInForm.tsx` - Line 110

## 🛡️ CAPTCHA hoạt động như thế nào?

### 1. Smart CAPTCHA (Default)

Clerk sẽ tự động render CAPTCHA widget vào element `#clerk-captcha`:

```tsx
{
    /* CAPTCHA element for bot protection */
}
<div id="clerk-captcha" />;
```

**Visible CAPTCHA:** User sẽ thấy checkbox "I'm not a robot" hoặc challenge nếu Clerk detect suspicious activity.

### 2. Invisible CAPTCHA (Fallback)

Nếu không tìm thấy element `#clerk-captcha`, Clerk sẽ fallback sang Invisible CAPTCHA:

- Chạy ngầm, không hiển thị UI
- Chỉ show challenge nếu detect bot behavior

## 🎯 CAPTCHA Modes trong Clerk

Bạn có thể cấu hình trong Clerk Dashboard:

### Mode 1: Smart (Recommended) ✅

- Hiển thị CAPTCHA khi cần thiết
- Balance giữa UX và security
- Tự động detect suspicious traffic

### Mode 2: Always

- Luôn hiển thị CAPTCHA
- Maximum security
- Trade-off: UX không tốt cho người dùng thật

### Mode 3: Off (Development only)

- Tắt hoàn toàn CAPTCHA
- Chỉ dùng khi development
- KHÔNG nên dùng production

## 🔧 Cấu hình trong Clerk Dashboard

1. Đăng nhập vào [Clerk Dashboard](https://dashboard.clerk.com)

2. Chọn application của bạn

3. Vào **User & Authentication** → **Attack Protection**

4. Tìm section **Bot sign-up protection**

5. Chọn mode:

    ```
    ○ Off              (development only)
    ● Smart CAPTCHA    (recommended)
    ○ Always require   (high security)
    ```

6. Lưu thay đổi

## 📍 CAPTCHA Position trong Form

CAPTCHA sẽ render tại vị trí element `#clerk-captcha`:

**Sign Up Form:**

```tsx
<SignUpFormLayout>
    <SignUpFormField ... />  {/* Họ tên */}
    <SignUpFormField ... />  {/* Ngày sinh */}
    <SignUpFormField ... />  {/* CCCD */}
    <SignUpFormField ... />  {/* Công ty */}

    {/* CAPTCHA renders here */}
    <div id="clerk-captcha" />

    <button type="submit">Đăng ký</button>
</SignUpFormLayout>
```

**Sign In Form:**

```tsx
<SignInFormLayout>
    <SignInFormField ... />  {/* CCCD */}
    <SignInFormField ... />  {/* Ngày sinh */}

    {/* CAPTCHA renders here */}
    <div id="clerk-captcha" />

    <button type="submit">Đăng nhập</button>
</SignInFormLayout>
```

## 🎨 Custom Styling (Optional)

Nếu muốn style CAPTCHA widget:

```css
/* globals.css */
#clerk-captcha {
    margin: 1rem 0;
    display: flex;
    justify-content: center;
}

/* Clerk's CAPTCHA iframe */
#clerk-captcha iframe {
    border-radius: 8px;
}
```

Hoặc inline style:

```tsx
<div
    id="clerk-captcha"
    style={{
        margin: "1rem 0",
        display: "flex",
        justifyContent: "center",
    }}
/>
```

## 🧪 Testing CAPTCHA

### Development:

1. CAPTCHA thường ít khi xuất hiện (Clerk trust localhost)
2. Có thể test bằng cách:
    - Đăng ký nhiều lần liên tục
    - Clear cookies và retry
    - Use incognito mode

### Production:

- CAPTCHA sẽ active đầy đủ
- User thật thường không thấy challenge (good UX)
- Bot sẽ bị block

## 🚨 Troubleshooting

### Warning vẫn còn?

1. **Clear cache và reload:**

    ```bash
    # Stop dev server
    # Restart
    npm run dev
    ```

2. **Check element đã render?**

    ```javascript
    // Browser console
    document.getElementById("clerk-captcha");
    // Should return: <div id="clerk-captcha"></div>
    ```

3. **Verify Clerk loaded:**
    ```javascript
    // Check if Clerk initialized
    window.Clerk;
    ```

### CAPTCHA không hiển thị?

- Đúng rồi! Smart CAPTCHA chỉ show khi cần
- Trong development thường invisible
- Production sẽ active khi detect suspicious activity

### CAPTCHA verification failed?

- Network issue → Check internet connection
- Clerk service down → Check [status.clerk.com](https://status.clerk.com)
- Configuration issue → Verify Clerk Dashboard settings

## 📚 Resources

- [Clerk Bot Protection Docs](https://clerk.com/docs/security/bot-protection)
- [Custom Flows with CAPTCHA](https://clerk.com/docs/guides/development/custom-flows/bot-sign-up-protection)
- [Attack Protection Settings](https://clerk.com/docs/security/attack-protection)

## ✅ Summary

**Đã fix:**

- ✅ Thêm `<div id="clerk-captcha" />` vào Sign Up form
- ✅ Thêm `<div id="clerk-captcha" />` vào Sign In form
- ✅ Warning sẽ không còn xuất hiện
- ✅ CAPTCHA sẽ protect khỏi bot spam

**Next steps (optional):**

- Cấu hình CAPTCHA mode trong Clerk Dashboard
- Test CAPTCHA behavior trong production
- Monitor bot signup attempts trong Clerk Analytics
