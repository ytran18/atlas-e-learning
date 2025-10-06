# Cloudflare R2 CORS Setup for Progressive Video Streaming

## 🎯 Why CORS Configuration is Important

For progressive video streaming (HTTP Range Requests) to work properly, R2 must be configured to:

1. Allow `Range` headers in requests
2. Expose `Content-Range`, `Content-Length`, and `Accept-Ranges` headers in responses

## 📋 Setup Steps

### Method 1: Using Wrangler CLI (Recommended)

1. **Install Wrangler** (if not already installed):

```bash
npm install -g wrangler
```

2. **Login to Cloudflare**:

```bash
wrangler login
```

3. **Apply CORS configuration**:

```bash
wrangler r2 bucket cors put <YOUR_BUCKET_NAME> --file=cors-config.json
```

Replace `<YOUR_BUCKET_NAME>` with your actual R2 bucket name.

4. **Verify configuration**:

```bash
wrangler r2 bucket cors get <YOUR_BUCKET_NAME>
```

### Method 2: Using Cloudflare API

```bash
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/r2/buckets/{bucket_name}/cors" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data @cors-config.json
```

Replace:

- `{account_id}` - Your Cloudflare Account ID
- `{bucket_name}` - Your R2 bucket name
- `{api_token}` - Your Cloudflare API token with R2 permissions

## 🔍 CORS Configuration Explained

```json
{
    "AllowedOrigins": [
        "http://localhost:3000", // Local development
        "https://atld-prod.vercel.app/", // Production domain
        "https://atld-staging.vercel.app/" // Staging domain
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*", "Range", "Content-Range"], // Critical for video streaming
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Range", "Accept-Ranges"], // Critical for progressive loading
    "MaxAgeSeconds": 3600
}
```

### Key Headers for Video Streaming:

- **`Range`**: Allows browser to request specific byte ranges
- **`Content-Range`**: Server response indicating which bytes are being returned
- **`Accept-Ranges`**: Tells browser that server supports range requests
- **`Content-Length`**: Total file size

## ✅ Testing CORS Configuration

### 1. Test Range Request Support

```bash
curl -I "https://your-r2-public-url.r2.dev/video/test.mp4" \
  -H "Range: bytes=0-1000" \
  -H "Origin: http://localhost:3000"
```

**Expected response:**

- Status: `206 Partial Content`
- Header: `Accept-Ranges: bytes`
- Header: `Content-Range: bytes 0-1000/TOTAL_SIZE`
- Header: `Access-Control-Allow-Origin: http://localhost:3000`

### 2. Test in Browser

1. Upload a video through your app
2. Open browser DevTools → Network tab
3. Play the video
4. You should see multiple requests with `Range: bytes=...` headers
5. Responses should have status `206 Partial Content`

## 🐛 Troubleshooting

### Error: "No 'Access-Control-Allow-Origin' header"

**Cause**: CORS not configured or domain not in `AllowedOrigins`

**Fix**:

1. Check CORS configuration: `wrangler r2 bucket cors get YOUR_BUCKET_NAME`
2. Add your domain to `AllowedOrigins` in `cors-config.json`
3. Reapply configuration

### Error: Video loads entire file before playing

**Cause**: Range requests not supported or CORS blocking them

**Fix**:

1. Ensure `Range` is in `AllowedHeaders`
2. Ensure `Accept-Ranges`, `Content-Range` are in `ExposeHeaders`
3. Verify video file has `ContentDisposition: inline` (set in upload API)

### Error: "206 Partial Content" not received

**Cause**: R2 not configured for range requests

**Fix**:

1. Check video file metadata
2. Ensure `ContentDisposition: inline` is set
3. Verify CORS headers are exposed properly

## 📝 Update CORS for New Domains

When deploying to a new domain:

1. Edit `cors-config.json`:

```json
{
    "AllowedOrigins": [
        "http://localhost:3000",
        "https://your-new-domain.com"  // Add your new domain
    ],
    ...
}
```

2. Reapply configuration:

```bash
wrangler r2 bucket cors put YOUR_BUCKET_NAME --file=cors-config.json
```

## 🔒 Security Notes

- ⚠️ Avoid using `"*"` in `AllowedOrigins` for production
- ✅ List specific domains that need access
- ✅ Update CORS when deploying to new environments
- ✅ Use HTTPS for all production domains

## 📚 Resources

- [Cloudflare R2 CORS Documentation](https://developers.cloudflare.com/r2/api/s3/api/)
- [HTTP Range Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
