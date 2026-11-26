# Support Ticket Management System

A MERN-based mini helpdesk application. Users can submit support tickets, track their progress and communicate with the support team. Admins can manage tickets, update their status and priority, and review activity history.

## Tech stack

- Frontend: React, Vite, React Router, Tailwind CSS, Axios, React Hot Toast, Lucide React
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Authentication: JWT stored in an HTTP-only cookie, bcryptjs password hashing
- Event handling: Node.js EventEmitter with MongoDB activity logs

## Project structure

```text
support-ticket-system/
├── backend/
│   ├── server.js
│   └── src/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── scripts/
│       ├── services/
│       └── utilities/
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── routes/
├── docs/
└── README.md
```

The backend follows the same separation used in the MovieMart repository: controllers handle request logic, models define MongoDB schemas, routes map endpoints, middleware handles access control, and services/utilities hold shared functionality. The frontend keeps API setup, reusable components, pages and routes separate.

## Features

### User
- Register and log in
- Create and view own tickets
- Edit open tickets and delete open tickets
- Filter tickets by status and search by text
- Add comments and view the ticket activity history

### Admin
- View all tickets
- Filter by status, priority and search text
- View ticket details, comments and activity
- Change ticket status and priority
- View ticket and user statistics

### Ticket workflow
- Statuses: Open, In Progress, Resolved, Closed
- Priorities: Low, Medium, High, Urgent
- Categories: Technical, Account, Billing, General, Other
- Important actions emit an event. An event listener stores the action in the ActivityLog collection.

## Local setup

### Requirements
- Node.js 18+
- MongoDB local installation or MongoDB Atlas database

### 1. Configure backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set your MongoDB connection string and a long random JWT secret.

```bash
npm run seed:admin
npm run dev
```

The API starts at `http://localhost:5000`.

### 2. Configure frontend

Open another terminal:

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`, then run:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Admin account

The public registration endpoint always creates a `user` role. It never accepts a role from the client. Create the first administrator with the backend seed script:

1. Set `ADMIN_NAME`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`.
2. Run `npm run seed:admin` from the backend folder.
3. Log in using that email and password.

Do not expose the seed credentials or commit `.env` files.

## API overview

All endpoints are prefixed with `/api`. Authentication uses the `accessToken` HTTP-only cookie.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Register user |
| POST | `/auth/login` | Public | Login |
| POST | `/auth/logout` | Logged in | Logout |
| GET | `/auth/me` | Logged in | Current user |
| POST | `/tickets` | Logged in | Create ticket |
| GET | `/tickets` | Logged in | List own tickets or all tickets for admin |
| GET | `/tickets/:id` | Owner or admin | Ticket details, comments and activity |
| PUT | `/tickets/:id` | Owner or admin | Edit ticket details |
| DELETE | `/tickets/:id` | Owner or admin | Delete ticket |
| POST | `/tickets/:id/comments` | Owner or admin | Add comment |
| GET | `/admin/stats` | Admin | Dashboard statistics |
| PATCH | `/admin/tickets/:id` | Admin | Update status and priority |

List endpoint query parameters: `page`, `limit`, `status`, `priority`, `search`.

## Database design

- **User**: name, email, password hash, role, timestamps.
- **Ticket**: title, description, category, priority, status, createdBy, resolvedAt, timestamps.
- **Comment**: ticket reference, user reference, message, timestamps.
- **ActivityLog**: ticket reference, user reference, action, details, timestamps.

Comments and activity logs are separate collections so each ticket can have an unlimited conversation and activity history without growing one embedded document indefinitely.

## Security and implementation notes

- Passwords are hashed with bcryptjs.
- JWT is stored in an HTTP-only cookie, not localStorage.
- User role is assigned on the server. Public registration cannot create an admin.
- Admin endpoints check the authenticated user's role.
- Regular users can only access tickets they created.
- Ticket status and priority are validated on the server.
- Helmet, CORS allow-list, request size limit and centralized error handling are configured.
- In production, set `COOKIE_SECURE=true`, use HTTPS, set `FRONTEND_URL` to your deployed frontend origin, and use a strong JWT secret.

## Deployment

- Deploy the backend to Render or another Node.js host.
- Set backend environment variables in the hosting dashboard.
- Use MongoDB Atlas for the database.
- Deploy the frontend to Vercel.
- Set `VITE_API_URL` to the deployed backend API base URL, for example `https://your-api.example.com/api`.
- Set backend `FRONTEND_URL` to the exact Vercel origin and `COOKIE_SECURE=true`.

For cross-site cookies, frontend and backend must use HTTPS and the backend CORS origin must exactly match the frontend origin.

## Before submission

- Test user and admin flows using separate accounts.
- Test that a user cannot open another user's ticket by changing the ticket ID.
- Test that a normal user cannot access admin APIs.
- Test create, edit, delete, comments and status updates.
- Add your actual deployed URLs to this README after deployment.
