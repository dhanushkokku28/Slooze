# Frontend - Slooze Food Console

Next.js dashboard for the role-based food ordering challenge.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Default URL: http://localhost:3000

The app calls the backend GraphQL endpoint at `http://localhost:4000/graphql`.
Override it with:

```bash
set NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

## What this UI demonstrates

- Switch active identity using seeded users.
- Browse restaurants and menu items by country.
- Create orders (all roles).
- Checkout and cancel orders (Admin + Manager only).
- Add and modify payment methods (Admin only).
- Country-scoped relational access (India users cannot operate on America data, and vice versa).
