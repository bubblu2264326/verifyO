# 🛡️ VerifyO - Architectural Overview

VerifyO is a high-security, full-stack application designed to provide cryptographic "Proof of Existence" for digital documents without compromising user privacy.

## 📺 Project Demo

<video src="https://github.com/bubblu2264326/verifyO/blob/main/Demo.mp4?raw=true" controls="controls" style="max-width: 100%;">
  Your browser does not support the video tag.
</video>

> [!NOTE]
> *The video above demonstrates the full document upload, local hashing, and cloud verification flow.*

This document serves as the central architectural reference for the system, detailing the tech stack, structural organization, and core security decisions.

---

## 🏗️ System Architecture

VerifyO is built on a decoupled Client-Server architecture, emphasizing strict separation of concerns, scalability, and privacy-by-design.

### Backend Infrastructure
*   **Framework:** Node.js with Express.js
*   **Language:** TypeScript (for strong typing and error prevention)
*   **Database:** PostgreSQL with Prisma ORM
*   **Key Design Pattern:** Layered architecture strictly dividing routing, controllers (request parsing), and services (business logic/database operations).

### Frontend Infrastructure
*   **Framework:** Next.js 15 (App Router, React 19)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4 + Vanilla CSS with Custom Properties
*   **State Management:** Zustand (Auth persistence)
*   **Key Design Pattern:** The frontend handles cryptographic hashing locally using the Web Crypto API, minimizing the payload transmitted to the server.

---

## 📂 Directory Structure

### Backend (`/backend`)
```text
/backend
├── src/
│   ├── app.ts              # Express app setup and middleware definition
│   ├── server.ts           # Server entry point (app.listen)
│   ├── config/             # Environment validation (Zod) and DB initialization
│   ├── routes/             # API Route definers
│   ├── controllers/        # Request handling and response mapping
│   ├── services/           # Core business logic (DB queries, hashing logic)
│   ├── middleware/         # Auth guards, Rate limiters, Error Handler, File Uploads
│   ├── utils/              # Helper functions (Crypto wrappers)
│   └── types/              # TypeScript Definitions
├── prisma/                 # PostgreSQL Schema definition
└── uploads/                # Ephemeral local directory for processing verification files
```

### Frontend (`/frontend`)
```text
/frontend
├── src/
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   │   ├── admin/          # Restricted administrative interface
│   │   ├── dashboard/      # Private user document vault
│   │   ├── login/          # Authentication entry
│   │   ├── verify/         # Public-facing validation console
│   │   └── layout.tsx      # Root layout and theme providers
│   ├── components/         # Reusable UI elements (CandyButton, BentoCard, etc.)
│   ├── lib/                # Core utilities (API client, SHA-256 Hashing)
│   └── store/              # Zustand global state (authStore)
└── tailwind.config.ts      # Tailwind token definitions
```

---

## 🔌 Core API Endpoints

The backend exposes a RESTful API protected by stateless JSON Web Tokens.

*   `POST /api/auth/register` - Creates a new user (bcrypt password hashing).
*   `POST /api/auth/login` - Authenticates and issues `HttpOnly` cookie tokens.
*   `GET /api/auth/me` - Validates the active session.
*   `POST /api/auth/logout` - Invalidates the current session.
*   `POST /api/documents/upload` - Stores a document hash (or the file itself if selected) permanently.
*   `POST /api/documents/verify` - Accepts a file, hashes it server-side, and compares it against the database.
*   `GET /api/documents/me` - Retrieves the authenticated user's document history.
*   `DELETE /api/admin/documents/:id` - (Admin Only) Removes a document record.
*   `GET /api/admin/users` - (Admin Only) Retrieves all registered users.

---

## 🔐 Security Decisions & Implementation

Security is the foundational pillar of VerifyO, aligning strictly with OWASP Top 10 standards:

1.  **Zero-Knowledge Uploads (Privacy-by-Design):** 
    *   File hashing is performed locally on the frontend via the browser's `SubtleCrypto` API. 
    *   By default, the server only receives the SHA-256 hash and metadata. Sensitive document contents are never transmitted over the network or stored on the server unless full verification is required.
2.  **Stateless, Secure Authentication:** 
    *   Authentication relies on JWTs with a short expiration.
    *   **Crucially**, tokens are transmitted exclusively via `HttpOnly`, `Secure`, and `SameSite=Strict` cookies. This makes the session tokens mathematically invisible to JavaScript, rendering Cross-Site Scripting (XSS) token theft impossible.
    *   Passwords are computationally secured using `bcrypt` with a cost factor of 12.
3.  **Brute-Force & DoS Protection:** 
    *   `express-rate-limit` is implemented globally on the Express instance.
    *   Aggressive thresholds are placed on sensitive endpoints (e.g., maximum 5 attempts per 15 minutes on `/api/auth/login`) to prevent credential stuffing.
4.  **Strict Input Validation & Injection Prevention:** 
    *   `zod` schema validation is enforced on all incoming requests at the middleware level. 
    *   Malformed or unexpected JSON payloads are dropped before they reach the controller logic, thwarting SQL/NoSQL injection attempts at the gateway.
5.  **Hardened HTTP Headers:** 
    *   `helmet` middleware is deployed to automatically inject strict security headers into every response.
    *   Headers include `X-Content-Type-Options: nosniff` (preventing MIME-confusion attacks), `Strict-Transport-Security` (enforcing HTTPS), and `X-Frame-Options` (preventing clickjacking).
6.  **Role-Based Access Control (RBAC):** 
    *   Administrative API routes are protected by a dual-layer middleware approach (`requireAuth` followed by `requireAdmin`).
    *   The `requireAdmin` middleware explicitly verifies the user's role against the active database row on every request, preventing horizontal and vertical privilege escalation.
7.  **File Upload Hardening:**
    *   The `/api/documents/verify` endpoint uses `multer` configured with strict file size limits (e.g., 5MB) to prevent disk exhaustion attacks.
    *   Uploaded files are processed purely for their hash signature and discarded, rather than permanently stored, minimizing the attack surface.

---

## 🚀 Setup & Installation Instructions

Although this system is deployed in the cloud, authorized auditors or developers may need to run the application locally.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [PostgreSQL](https://www.postgresql.org/) (Running locally or via a cloud provider)

### 1. Repository Setup
```bash
git clone <repository-url>
cd verifyo
```

### 2. Backend Initialization
The backend server handles all cryptographic verification and database interactions.
```bash
cd backend
npm install            # Install Node dependencies
npx prisma db push     # Prepare the SQL database schema
npx prisma generate    # Generate the ORM classes
npm run dev            # Start backend server
```
*The backend connects to PostgreSQL and runs locally on `http://localhost:5000`.*

### 3. Frontend Initialization
The Next.js frontend delivers the user interface and performs client-side hashing. Open a **new terminal session**:
```bash
cd frontend
npm install            # Install Next.js dependencies
npm run dev            # Start the UI server
```
*The frontend interfaces with the backend and runs on `http://localhost:3000`.*

---

## ⚙️ Environment Variables

The system requires specific environment variables to bridge the frontend and backend, and the backend with the database. You must create a `.env` file in both the `/frontend` and `/backend` directories based on the provided `.env.example` templates.

### Backend Configuration (`/backend/.env`)

These credentials securely connect the backend to the database and establish the JWT cryptographic signing keys.

| Variable | Requirement | Description |
| :--- | :--- | :--- |
| `PORT` | Optional | The port number the Express.js server will bind to (default: `5000`). |
| `DATABASE_URL` | **Required** | The connection string for the PostgreSQL database. |
| `DIRECT_URL` | Optional | A direct (non-pooled) connection string, required by Prisma schema migrations. |
| `JWT_SECRET` | **Required** | A cryptographically secure, random string used to sign JSON Web Tokens. |
| `CORS_ORIGIN` | **Required** | The exact URL of the frontend application (`http://localhost:3000`). |

### Frontend Configuration (`/frontend/.env` or `/frontend/.env.local`)

These variables instruct the Next.js runtime where to securely route API requests.

| Variable | Requirement | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | **Required** | The base URL of the deployed backend server (`http://localhost:5000/api`). |
