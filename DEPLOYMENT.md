# School Hall Booking backend

## Local development

1. Copy `.env.example` to `.env`.
2. Set a real MongoDB connection string and a long `JWT_SECRET`.
3. Set `ADMIN_EMAILS` to a comma-separated list of administrator emails.
4. Set `CORS_ORIGINS=http://localhost:5173,http://localhost:4173`.
5. Run `npm install` and `npm run dev`.
6. Verify `GET http://localhost:5000/health`.

## Render

- Repository: `school-hall-booking-backend`
- Branch: `main`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAILS`, `CORS_ORIGINS`, `NODE_ENV=production`
- Add the deployed Netlify and Vercel origins to `CORS_ORIGINS`.
- Verify `https://school-hall-api.onrender.com/health` returns HTTP 200.

## API security

- Passwords are hashed with bcrypt.
- JWTs expire after one hour.
- Admin list and status changes require a valid JWT and the admin role.
- Login, signup and password reset are rate limited.
- Helmet security headers, CORS allowlisting and a JSON body limit are enabled.
- Mongoose schemas validate fields and reservation conflicts are checked server-side.
- Secrets are environment variables and `.env` is ignored by Git.
