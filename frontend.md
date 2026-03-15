# Frontend Architecture & Implementation Plan

The frontend will be built to impress, focusing on a premium user experience with robust security measures at the client level.

## Tech Stack
*   **Framework**: Next.js (App Router for modern routing and Server Components capability).
*   **Styling**: Tailwind CSS for utility-first styling.
*   **Animations**: Framer Motion for micro-interactions, page transitions, and a premium feel.
*   **Form Validation**: React Hook Form + Zod for strict client-side validation.
*   **State Management**: React Context / Zustand (if complex state is needed, though standard hooks should suffice).

## Project Structure
```text
/frontend
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── (auth)/         # login, register
│   │   ├── dashboard/      # User dashboard (upload)
│   │   ├── verify/         # Public/Protected verification page
│   │   ├── admin/          # Admin dashboard
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Base components (buttons, inputs)
│   │   ├── forms/          # Form components
│   │   └── layout/         # Navigation, wrappers
│   ├── lib/                # Utility functions (api client, hashing)
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript interfaces
```

## Core Features & Security Implementation

### 1. User Authentication (Task 1)
*   **Design**: Glassmorphism or sleek dark-mode forms.
*   **Validation**: Strict Zod schemas for email formats and strong password requirements (min length, special chars).
*   **Session**: We will configure the frontend to securely handle HttpOnly cookies set by the backend. We will NOT store JWTs in `localStorage`.
*   **Protection**: Next.js Middleware to protect `/dashboard` and `/admin` routes on the client/edge side.

### 2. Secure Document Upload (Task 2)
*   **Interface**: A sleek Drag-and-Drop zone with progress indicators.
*   **Client-Side Hashing**: We will use the Web Crypto API (`crypto.subtle.digest('SHA-256', fileBuffer)`) to calculate the SHA-256 hash *in the browser* and display it to the user *before* upload.
*   **Pre-Upload Validation**: Check file type (`.pdf`, `.png`, `.jpg`) and file size (e.g., < 5MB) before ever hitting the server.

### 3. Document Verification Page (Task 3)
*   **Workflow**: User drops a file -> Client calculates hash -> Sends hash to backend -> Backend responds with "Verified" or "Invalid".
*   **UI**: Elegant state transitions indicating loading, success (green check/certificate style), or failure (red warning).

### 4. Admin Dashboard (Task 4)
*   **Access**: Route completely hidden/redirected unless the user role is `ADMIN`.
*   **Data Table**: A rich table component to list all documents, users, timestamps, and hashes, with search capabilities.
*   **Actions**: Secure UI to trigger file deletion.

## Design Aesthetics (The "Wow" Factor)
To ensure this passes the test with flying colors:
*   We will avoid a basic, raw HTML look.
*   Use a curated dark theme palette (e.g., deep slate backgrounds, vibrant primary accent colors like electric blue or emerald green).
*   Implement smooth fade-ins on load.
*   Provide immediate, clear, and beautiful toast notifications for errors and successes.
