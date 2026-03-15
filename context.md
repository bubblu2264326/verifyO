Secure Document Verification Platform Test
Full Stack Developer Technical Test
Duration
24 Hours
Stack Requirements
Frontend: Next.js
Backend: Node.js with TypeScript
Database: PostgreSQL or MongoDB
Authentication: JWT based authentication
Demo Requirement
The candidate must present the full system running locally.

During the live presentation they must show:
- Backend server running
- Next.js frontend running
- Database connected
- Complete user workflow

The project must run on localhost during the demo.
Objective
Build a Secure Document Verification Platform.

Users upload a document.
The system generates a cryptographic hash.
The system stores the document and metadata securely.
Users later verify if the document was modified.
Core Features
User Authentication
Secure File Upload
Document Hash Verification
Admin Dashboard
Task 1: User Authentication
Frontend:
- Register page
- Login page
- Form validation
- Session handling

Backend:
- Password hashing using bcrypt
- JWT token generation
- Protected API routes

Security Requirement:
Plain text password storage fails the test immediately.
Task 2: Secure Document Upload
Frontend:
- File upload interface
- Display SHA256 hash before upload

Backend:
- Recalculate SHA256 hash server side
- Store uploaded file locally
- Store metadata in database

Metadata fields:
- userId
- fileName
- fileHash
- timestamp
- storagePath

Security requirements:
- Restrict file types to pdf, png, jpg
- Limit upload size
Task 3: Document Verification Page
Create a page where a user uploads a file for verification.

System must:
1. Generate the file hash
2. Compare it with stored records
3. Display verification result

Display:
- Valid document
- Modified document
- Upload timestamp
- Original uploader
Task 4: Admin Dashboard
Admin must be able to:

- View all uploaded documents
- Search documents by hash or user
- Delete suspicious files

Security Requirement:
Only admin users can access this dashboard.
Task 5: API Security
Candidate must implement at least three protections:

- Rate limiting
- Input validation
- CORS configuration
- JWT expiration
- SQL injection protection
- File upload validation
Task 6: Project Structure
Repository must contain:

/frontend
/backend

Backend should separate:
- routes
- controllers
- services
- middleware
Task 7: Documentation
Repository must include a README containing:

- Architecture explanation
- Security decisions
- Installation instructions
- Environment variables
Task 8: Live Demonstration
During the presentation the candidate must demonstrate:

1. User registration
2. Login
3. Document upload
4. Document verification
5. Admin dashboard access

Interview questions during the demo:

- Why hash the document?
- How do you prevent malicious uploads?
- What happens if two users upload the same document?
- How would you scale file storage?

so my focus will be building end to end ....application.........So, let's set the context first. I basically applied for an internship. They are looking for a Mern developer with security. They are looking for an internship. They are giving an internship with 30,000 rupees stipend per month. And they want me, they are basically looking for a Mern developer with security, with vulnerability assessment. Okay, so they set up an interview. They asked me my experience, etc. and they told me that they will give me the report sheet, etc. for training. But before that, we will give you a test and you have to do that, you have to do the test before we get you on board. So, that's what they said, okay. So, the test I shared with you is that, let's help me to understand what they basically wanted to build. What is the purpose of this application they wanted me to build. Okay, first let's understand what they actually want, okay. Then we will dive into technical details. Then we will choose, like, what we should do, what we should not do. And then we will plan how to build this application, okay. And remember, I'm not just building it for the test, okay. I am an experienced developer. I have been working with Node.js and Next.js for about two years. So, I am looking for more than a scam. I am looking for end-to-end application with proper security features.


lets d iscuss with me how we should implement this ,,,

For **this specific technical test**, the better choice is **PostgreSQL**. Let’s analyze it from an engineering and interview perspective.

---

# 1. What the System Actually Stores

Your system stores **structured metadata**, not unstructured documents.

Metadata fields given in the test:

```
userId
fileName
fileHash
timestamp
storagePath
```

This is clearly **relational data**.

You also have relationships:

```
User → Documents
Admin → Documents
```

Schema looks like:

```
users
-----
id
email
passwordHash
role

documents
---------
id
userId
fileName
fileHash
timestamp
storagePath
```

This is a **classic relational schema**.

PostgreSQL handles this perfectly.

---

# 2. Why PostgreSQL Is Better Here

### 1️⃣ Strong data integrity

You can enforce constraints:

```
FOREIGN KEY
UNIQUE
NOT NULL
```

Example:

```
fileHash UNIQUE
```

This prevents duplicate documents automatically.

MongoDB cannot enforce relational integrity as strongly.

---

### 2️⃣ Preventing duplicate files

Example:

If two users upload the same file:

```
same SHA256 hash
```

In PostgreSQL you can simply do:

```
UNIQUE(fileHash)
```

Then handle duplicates cleanly.

---

### 3️⃣ Strong SQL injection protection

Using libraries like:

```
Prisma
Drizzle
pg
```

You get parameterized queries automatically.

---

### 4️⃣ Easier searching

Admin dashboard requires:

```
search by hash
search by user
```

SQL queries are extremely efficient for this.

Example:

```sql
SELECT * FROM documents
WHERE fileHash = $1;
```

---

# 3. Why MongoDB Is Worse for This Test

MongoDB is better when data is:

* flexible
* schema-less
* document oriented

Example use cases:

```
logs
chat messages
analytics
content feeds
```

Your system is **not that**.

Your data is **structured and relational**.

---

# 4. What Security Engineers Prefer

Security systems commonly use:

```
PostgreSQL
MySQL
```

Why?

Because of:

```
transactions
ACID guarantees
constraints
auditing
```

For example:

```
financial systems
identity systems
medical systems
```

All relational.

---

# 5. Interview Perspective

Using PostgreSQL also shows **stronger backend maturity**.

If they ask:

> Why did you choose PostgreSQL?

You answer:

**Example answer:**

> The application stores structured metadata with relationships between users and documents. PostgreSQL provides strong ACID guarantees, relational integrity via foreign keys, and efficient indexing for searching by file hash. It also integrates well with TypeScript ORMs like Prisma, which helps prevent SQL injection through parameterized queries.

That answer sounds **very professional**.

---

# 6. Recommended Stack

For this project I would use:

```
Frontend
Next.js 14
React
Tailwind

Backend
Node.js
Express
TypeScript

Database
PostgreSQL
Prisma ORM

Auth
JWT
bcrypt

File Upload
multer

Security
helmet
express-rate-limit
zod validation
```

---

# 7. Database Schema (Clean Design)

Example Prisma schema:

```
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      Role
  documents Document[]
}

model Document {
  id          String   @id @default(uuid())
  fileName    String
  fileHash    String   @unique
  storagePath String
  createdAt   DateTime @default(now())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}

enum Role {
  USER
  ADMIN
}
```

---

# 8. One Important Optimization

Add an index for hash lookup:

```
INDEX(fileHash)
```

Because verification will do:

```
search by hash
```

---

# 9. Final Recommendation

For this test:

✅ **Use PostgreSQL**

Do **not** use MongoDB unless:

* the company explicitly requires MERN.

Even then you could say:

> I chose PostgreSQL because the data is relational and requires strong integrity constraints.

That actually **impresses interviewers**.

---

If you'd like, I can also show you something extremely helpful for your test:

**The exact project folder structure that senior backend engineers use for Node + TypeScript projects.**

It will make your submission look **10× more professional** during the demo.


waht you say on these comments

here sis for backend
backend/
│
├── src/
│
│   ├── config/
│   │   ├── db.ts
│   │   └── env.ts
│
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── document.routes.ts
│   │   └── admin.routes.ts
│
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── document.controller.ts
│   │   └── admin.controller.ts
│
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── document.service.ts
│   │   └── hash.service.ts
│
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── admin.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── upload.middleware.ts
│
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   └── document.validator.ts
│
│   ├── utils/
│   │   ├── hash.ts
│   │   └── logger.ts
│
│   ├── types/
│   │   └── express.d.ts
│
│   ├── uploads/
│   │   └── documents/
│
│   ├── app.ts
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── package.json
└── tsconfig.json
here is for frontend
frontend/
│
├── app/
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── register/
│   │   └── page.tsx
│   │
│   ├── upload/
│   │   └── page.tsx
│   │
│   ├── verify/
│   │   └── page.tsx
│   │
│   ├── admin/
│   │   └── page.tsx
│   │
│   └── layout.tsx
│
├── components/
│   ├── FileUploader.tsx
│   ├── Navbar.tsx
│   ├── AuthForm.tsx
│   └── VerificationResult.tsx
│
├── services/
│   └── api.ts
│
├── utils/
│   └── hash.ts
│
├── middleware/
│   └── auth.ts
│
├── styles/
│   └── globals.css
│
└── package.json

now make sure to update the artifacts also ....update my backend.md and frointend.md in my file storage
Updating Frontend and Backend Plans
I am incorporating the excellent feedback regarding PostgreSQL and the provided professional folder structures. I will write these updates back to our 
frontend.md
 and 
backend.md
 implementation plan artifacts to keep everything aligned before coding begins.

Files Edited
Progress Updates
1
Updating the artifact files with the user-provided folder structures and database choice

Setup Project Structure
I have perfectly aligned both 
frontend.md
 and 
backend.md
 plans with your professional folder structure suggestions and the strategy to use PostgreSQL. I am now moving into execution to scaffold the frontend application.

Progress Updates
1
Initializing the Next.js frontend a