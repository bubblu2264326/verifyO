# Backend

Express + TypeScript + Prisma/Postgres backend for the secure document verification platform.

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm test`
- `pnpm prisma:validate`
- `pnpm prisma:deploy`
- `pnpm bootstrap:admin`

## Environment

See [.env.example](/home/oops/projects/smb_test/backend/.env.example).

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/documents/upload`
- `POST /api/documents/verify`
- `GET /api/documents/me`
- `GET /api/admin/documents`
- `DELETE /api/admin/documents/:id`
