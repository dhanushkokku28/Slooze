# Slooze Take-Home Challenge Solution

Full-stack role-based food ordering app with country-scoped relational access.

## Project structure

- `backend` - NestJS + GraphQL + Prisma API
- `frontend` - Next.js + Tailwind + Apollo dashboard

## Local setup

### 1) Backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start
```

Backend endpoint: http://localhost:4000/graphql

### 2) Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: http://localhost:3000

## Implemented features

- Role-based access control (Admin, Manager, Member)
- Country-level relational access control (India, America)
- Mocked restaurants and menu items
- Order create/checkout/cancel workflows
- Payment method add/modify workflows (Admin only)
- User switcher for testing all roles/countries quickly

## Notes

- Authentication is simulated with an `x-user-id` header for challenge speed.
- Seed script creates users for both countries and all three roles.
- GraphQL schema is generated code-first by NestJS.
