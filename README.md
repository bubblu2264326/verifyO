# VerifyO - Secure Document Integrity Protocol

VerifyO is a high-performance web platform designed for small-to-medium businesses (SMBs) to ensure document integrity using cryptographic fingerprints. It leverages client-side SHA-256 hashing and a sleek, Bento-style dashboard for a premium verification experience.

## ✨ Key Features

- **Sleek Bento UI**: Modern, modular interface built with Next.js 15 and Vanilla CSS.
- **Cryptographic Sovereignty**: SHA-256 hashes are calculated client-side before upload.
- **Instant Verification**: Public verification portal allowing anyone with a document to check its authenticity.
- **Admin Governance**: Powerful administrator tools for document management and audit trails.
- **Secure Authentication**: Cookie-based JWT sessions with automated re-authentication.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Zustand (State Management), Framer Motion (Animations).
- **Backend**: Node.js, Express, TypeScript, Prisma (ORM).
- **Database**: PostgreSQL.
- **Security**: Argon2 (Hashing), JWT (Session Management), SHA-256 (Document Integrity).

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL instance

### Installation

1. **Clone the repository**
2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env # Configure your DB and JWT secret
   npx prisma migrate dev
   npm run dev
   ```
3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🔒 Security Architecture

VerifyO follows a "Security First" philosophy:
1. **No Cold Storage**: We do not store the original documents. We only store the cryptographic fingerprints (hashes).
2. **Client-Side Hashing**: Hashes are computed in the browser to ensure the document content never leaves the user's environment unless explicitly uploaded for registry.
3. **HTTP-Only Cookies**: JWTs are stored in secure, HTTP-only cookies to prevent XSS-based token theft.

## 👨‍💻 Author
Built with Antigravity AI.
