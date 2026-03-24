# Backend - Slooze Food API

NestJS + GraphQL + Prisma backend for the role-based food ordering challenge.

## Tech

- NestJS
- GraphQL (code-first)
- Prisma + SQLite

## Run locally

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start
```

API URL: http://localhost:4000/graphql

## Demo auth model

No JWT is required for this challenge implementation.
Send `x-user-id` header on GraphQL requests.
Use `demoUsers` query to discover seeded user IDs.

## Role matrix implemented

- View restaurants and menu items: Admin, Manager, Member
- Create order: Admin, Manager, Member
- Checkout: Admin, Manager
- Cancel order: Admin, Manager
- Add and modify payment methods: Admin

## ReBAC extension implemented

All operational access is country-scoped by relationship checks:

- Users can only query restaurants in their country.
- Users can only operate on orders in their country.
- Admins can only manage payment methods for users in their country.
