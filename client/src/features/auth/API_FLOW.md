# Auth API Flow Documentation

## Architecture Overview

This document describes the clean, simple API flow for authentication operations.

---

## Flow Diagram

```
USER ACTION (Button Click)
    ↓
[Component/Page]
    ↓
handleLogin() | handleSignup() | handleVerifyEmail()
    ↓
[authService.ts - Business Logic Layer]
    ↓
loginUser() | registerBuyer() | registerSeller() | verifyOtp()
    ↓
[authApi.ts - API Calls Layer]
    ↓
axiosInstance (with interceptors)
    ↓
[shared/lib/axios.ts - HTTP Client]
    ↓
API Server
```

---

## Layer Breakdown

### 1. **Components** (UI Layer)
- Handles user input
- Calls service layer functions

```typescript
import { handleLogin } from "@features/auth/services/authService";

const onSubmit = async (formData) => {
  try {
    const response = await handleLogin(formData);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

---

### 2. **authService.ts** (Business Logic Layer)
- Normalizes data
- Handles authentication logic (signup vs buyer/seller)
- Stores tokens in localStorage
- Calls API layer

**Key Functions:**
- `handleLogin()` - Login flow with auto persistence
- `handleSignup()` - Auto-detect buyer/seller role
- `handleVerifyEmail()` - OTP verification
- `handleLogout()` - Clear auth data

```typescript
export const handleLogin = async (data: any) => {
  try {
    const response = await loginUser(data);
    const user = normalizeUser(response.data.user);
    persistAuth(response.data.accessToken, user);
    return response;
  } catch (error) {
    throw getError(error, "Login failed");
  }
};
```

---

### 3. **authApi.ts** (API Calls Layer)
- Pure API functions (no business logic)
- Wraps axiosInstance calls
- Returns raw API responses

**Available Functions:**
- `registerUser()`, `registerBuyer()`, `registerSeller()`
- `loginUser()`
- `verifyOtp()`, `resendOtp()`
- `forgotPassword()`, `verifyResetOtp()`, `resetPassword()`
- `getProfile()`

```typescript
export const loginUser = async (
  credentials: LoginFormValues
): Promise<ApiResponse<AuthSuccessPayload>> => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, credentials);
  return response;
};
```

---

### 4. **shared/lib/axios.ts** (HTTP Client)
- Single axios instance (centralized)
- Request interceptors: Adds auth token
- Response interceptors: Handles errors, auto-logout on 401
- FormData support (removes Content-Type for multipart)

**Features:**
- Auto token injection
- Auto logout on 401 (except login/register)
- Centralized error handling
- 30s timeout

---

## Usage Example

### Login Flow:

```typescript
// 1. Component (LoginForm.tsx)
import { handleLogin } from "@features/auth/services/authService";

const LoginForm = () => {
  const onSubmit = async (formData) => {
    try {
      const result = await handleLogin(formData);
      console.log("Logged in:", result.data.user);
    } catch (error) {
      console.error(error.message);
    }
  };
};

// 2. Service Layer (authService.ts) 
export const handleLogin = async (data: any) => {
  const response = await loginUser(data);  // ← Calls authApi
  persistAuth(response.data.accessToken, normalizeUser(response.data.user));
  return response;
};

// 3. API Layer (authApi.ts)
export const loginUser = async (credentials: LoginFormValues) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, credentials);
  return response;  // Already processed by response interceptor
};

// 4. HTTP Client (shared/lib/axios.ts)
// - Adds Authorization header
// - Sends request to server
// - Handles response/errors
```

---

## Error Handling

Errors are normalized in `authService.ts`:

```typescript
const getError = (error: any, fallback: string) => {
  const data = error.response?.data;
  const message = data?.message || error.message || fallback;
  const err = new Error(message) as any;
  if (data && typeof data === "object") {
    Object.assign(err, data);
  }
  return err;
};
```

**Auto Actions:**
- **401 (Unauthorized)**: Auto-redirects to login page
- **Other Errors**: Thrown to component for handling

---

## Storage Keys

- `STORAGE_KEYS.TOKEN` - Authentication token
- `STORAGE_KEYS.USER` - User object (JSON)

---

## Important Notes

✅ **Do Use**: `handleLogin()`, `handleSignup()` from authService  
✅ **Do Use**: API functions directly only if bypassing business logic needed  
❌ **Don't Bypass**: authService (it handles persistence & normalization)  
❌ **Don't Create**: Multiple axios instances  
❌ **Don't Modify**: shared/lib/axios.ts lightly (affects all API calls)

