# Deploy Support Ticket System on Render

This repository is a monorepo containing `backend/` (Express API) and `frontend/` (React + Vite). The `render.yaml` file in this patch configures both Render services through a Blueprint.

## Before deploying

1. Create a MongoDB Atlas cluster and a database user.
2. Add an Atlas Network Access rule that allows the Render service to connect. For a quick test, Atlas supports `0.0.0.0/0`; restrict access when possible.
3. Copy the MongoDB connection string and replace its username, password and database name. Do not commit this value.
4. Apply the files in this patch to the matching paths in your repository and push them to GitHub.

## Deploy both services

1. In Render, choose **New → Blueprint**.
2. Connect `piyush22123/support_ticket_system` and select the branch containing `render.yaml`.
3. Render reads the Blueprint and proposes two services:
   - `support-ticket-api`: Node.js web service on Render’s `free` compute plan with root directory `backend`.
   - `support-ticket-frontend`: static site with root directory `frontend`.
4. For the API service, enter the Atlas URI as `MONGO_URI`.
5. For the API service, set `FRONTEND_URL` to the exact frontend origin Render assigns, for example `https://support-ticket-frontend.onrender.com`. Do not add a trailing slash.
6. For the frontend service, set `VITE_API_URL` to the API URL plus `/api`, for example `https://support-ticket-api.onrender.com/api`.
7. Set `ADMIN_NAME`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` for the API service if you want to seed the first admin during this deployment. Keep the password private.
8. Deploy both services. If Render assigns a different frontend URL, update `FRONTEND_URL` in the API service and redeploy it.

The Blueprint explicitly sets the API to Render’s `free` compute plan, so it should not select a paid backend instance. The frontend static site is free. The Blueprint generates `JWT_SECRET` and enables secure cookies for production. The frontend's `VITE_API_URL` is a build-time variable, so redeploy the static site after changing it.

## Create the first admin

After the API has deployed and its environment variables are set, open the API service's Shell in Render and run:

```bash
npm run seed:admin
```

Run this once. The seed script creates an admin only if the configured email does not already exist. Do not use public registration to create an admin; public registration deliberately creates only regular users.

## Verify

1. Open `https://YOUR-API.onrender.com/api/health`. It should return JSON with `success: true`.
2. Open the frontend URL and register a normal user.
3. Sign in and create a ticket, add a comment and inspect ticket details.
4. Sign out, then sign in with the seeded admin account and verify the admin dashboard and ticket management.
5. If authentication fails, confirm both services use HTTPS, `VITE_API_URL` points to the API `/api` base, `FRONTEND_URL` exactly matches the frontend origin, `COOKIE_SECURE=true` and Axios uses `withCredentials: true`.

## Render service settings without a Blueprint

You can create the services manually instead:

### Backend Web Service

- Runtime: Node
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Environment variables: `NODE_ENV=production`, `COOKIE_SECURE=true`, `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, and the three `ADMIN_*` values if seeding an admin.

### Frontend Static Site

- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment variable: `VITE_API_URL=https://YOUR-API.onrender.com/api`
- Add a rewrite route: source `/*`, destination `/index.html`, type `rewrite` (keeps React Router URLs working on refresh).

## Important

- Never commit `.env` files, Atlas credentials, admin passwords or JWT secrets.
- Use the exact deployed frontend origin in the API CORS allow-list.
- Render static-site environment variables are used at build time. Rebuild after changing `VITE_API_URL`.
- This patch configures deployment; it does not prove the deployed app has been end-to-end tested. Test user and admin flows after deployment.
