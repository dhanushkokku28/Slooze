# Deployment Guide for Slooze

## Option 1: Deploy Frontend & Backend Separately (Recommended for Vercel)

This is the recommended approach for production as it gives you better control and scalability.

### Step 1: Set Up Database (Choose One)

**Using Supabase (PostgreSQL):**
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your PostgreSQL connection string
3. Save it as `DATABASE_URL` in your environment variables

**Using Railway (PostgreSQL):**
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string

### Step 2: Deploy Backend to Vercel

1. Create a new Vercel project pointing to your GitHub repository
2. Set **Root Directory** to `./backend`
3. Set **Build Command** to: `npm run build && npm run prisma:generate`
4. Set **Start Command** to: `npm run start:prod`
5. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NODE_ENV`: `production`

### Step 3: Get Backend URL

After deployment, Vercel will give you a URL like `https://slooze-backend.vercel.app`

### Step 4: Deploy Frontend to Vercel

1. Create another Vercel project for the frontend
2. Set **Root Directory** to `./frontend`
3. Set **Build Command** to: `npm run build`
4. Add environment variables:
   - `NEXT_PUBLIC_GRAPHQL_URL`: `https://slooze-backend.vercel.app/graphql`

### Step 5: Configure CORS (Backend)

Update your backend's `main.ts` to allow frontend requests:

```typescript
const app = await NestFactory.create(AppModule);
app.enableCors({
  origin: ['https://your-frontend-url.vercel.app'],
  credentials: true,
});
await app.listen(process.env.PORT || 4000);
```

---

## Option 2: Deploy Both to Single Vercel Project (Advanced)

If you want to keep everything in one Vercel project, you'll need to set up API routes as a proxy.

Create `frontend/pages/api/graphql/[[...params]].ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
  try {
    const response = await fetch(`${backendUrl}/graphql`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to proxy request' });
  }
}
```

---

## Troubleshooting

### 404 Error on GraphQL Endpoint
- Ensure `NEXT_PUBLIC_GRAPHQL_URL` is set correctly in environment variables
- Check that backend is running and accessible
- Verify CORS is enabled on the backend

### Build Fails
- Run `npm install` locally first to ensure dependencies are correct
- Check that `prisma generate` runs before the build
- Ensure all `.env` variables are set in Vercel project settings

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Ensure the database service allows connections from Vercel's IP range
- Run migrations: `npm run prisma:migrate`

---

## Local Development

```bash
# Terminal 1: Backend
cd backend
npm install
npm run prisma:generate
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` for the frontend and `http://localhost:4000/graphql` for the backend GraphQL playground.
