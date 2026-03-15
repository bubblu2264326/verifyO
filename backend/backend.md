# Backend Architecture & Implementation Plan

The backend focuses heavily on security, modularity, and clean Code structure, aligning with your MERN stack expertise while demonstrating advanced security practices.

## Tech Stack
*   **Framework**: Node.js with Express.js
*   **Language**: TypeScript for strong typing and error prevention.
*   **Database**: PostgreSQL with Prisma ORM (This provides strong ACID guarantees and relational integrity).
*   **Security & Validation**: bcrypt, jsonwebtoken, express-rate-limit, helmet, cors, multer, zod.

## Project Structure (Task 6)
Following best practices for maintainability and scalability, the backend will strictly separate concerns:

```text
/backend
├── src/
│   ├── app.ts              # Express app setup and middleware definition
│   ├── server.ts           # Server entry point (app.listen)
│   ├── config/             # DB connection, Env var validation
│   ├── routes/             # API Route definers (e.g., auth.routes.ts)
│   ├── controllers/        # Request handling and response mapping
│   ├── services/           # Core business logic (DB queries, hashing logic)
│   ├── middleware/         # Auth guards, Rate limiters, Error Handler, Upload processing
│   ├── models/             # Mongoose Schemas (User, Document)
│   ├── utils/              # Helper functions (Crypto wrappers)
│   └── types/              # TS Interfaces
├── uploads/                # Local directory for stored files
└── .env                    # Environment variables (excluded from VCS)
```

## Security Requirements Implementation (Task 5 & More)

### 1. Authentication & Sessions (Task 1)
*   **Storage**: Passwords will NEVER be stored in plain text. We will use `bcrypt` with a high salt round (e.g., 12).
*   **Tokens**: JWT tokens will be generated upon login.
*   **Transmission**: Tokens will be sent to the client as **`HttpOnly`, `Secure`, `SameSite=Strict` cookies**. This completely mitigates Cross-Site Scripting (XSS) attacks from stealing tokens, a major plus for a security-focused test.

### 2. Secure Document Upload (Task 2)
*   **Multer Configuration**:
    *   **Memory vs Disk**: We will configure Multer to store files locally into the `uploads/` folder.
    *   **File Type Validation**: Only `image/jpeg`, `image/png`, and `application/pdf` MIME types will be accepted *before* saving the file.
    *   **Size Limit**: Hard restriction (e.g., 5MB) via Multer limits to prevent Denial of Service (DoS) attacks via disk exhaustion.
*   **Server-Side Hashing**: Once uploaded, a service uses `crypto.createHash('sha256')` to read the file stream and generate the identical SHA-256 hash. If it matches the client's provided hash, we proceed.
*   **Database Record**: Store user ID (from JWT), generated file name (uuid to prevent collision), hash, timestamp, and local storage path in MongoDB.

### 3. API Security & Hardening (Task 5)
*   **Rate Limiting**: `express-rate-limit` will cap requests from the same IP (e.g., 100 per 15 mins globally, stricter 5-10 per 15 mins for `/login` and `/upload`).
*   **Input Validation**: `zod` will validate all `req.body` and `req.params` *before* hitting controllers, preventing NoSQL injection-like malformed objects.
*   **CORS**: Configured strictly to only allow the Next.js frontend origin (`http://localhost:3000`), blocking unauthorized cross-origin requests.
*   **Helmet**: Sets critical HTTP security headers (X-Content-Type-Options, Strict-Transport-Security, X-XSS-Protection). Let's protect against clickjacking and MIME-sniffing.
*   **Sanitization**: `express-mongo-sanitize` will be used as a final defense to entirely sanitize NoSQL injection vectors.
