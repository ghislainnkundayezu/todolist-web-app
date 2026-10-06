# Todo List Web App

A full-stack task manager built with React, TypeScript, Express, and MongoDB. Users can create an account, manage their task list, and view task activity statistics.

## Features

- **Account access:** sign up, log in with name, email, and password, and log out from the activity page. Passwords are hashed with bcrypt; authentication uses a JWT stored in an HTTP-only cookie. Tokens expire after 30 minutes.
- **Task management:** create tasks, edit their text inline, delete tasks, and toggle between ongoing and completed using a checkbox. New tasks start as ongoing.
- **Search:** filter the dashboard by task text with a case-insensitive search.
- **Activity statistics:** view ongoing, finished, deleted, and total task counts. Total represents all tasks created, including those later deleted.
- **Themes:** switch between light and dark themes from the dashboard. The selection is held in memory and resets on a page reload.
- **Persistence:** user accounts, tasks, and statistics are stored in MongoDB.
- **Protected pages:** the dashboard and activity page check authentication and redirect unauthenticated users to login.

## Technology

| Area | Tools |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, React Router |
| Data fetching | Axios, TanStack Query |
| Forms and feedback | React Hook Form, Yup, React Toastify |
| Backend | Express, TypeScript, Node.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens, bcrypt, cookie-parser |

## Project structure

```text
client/
  src/
    pages/         Authentication, dashboard, and activity screens
    customHooks/   Authentication, messaging, and theme hooks
    providers/     Message context
    utils/         API services and protected route handling
    styles/        Application styles
server/
  src/
    config/        JWT configuration
    controller/    Authentication, user, and task handlers
    middleware/    Cookie-based authentication
    model/         User and task schemas
    routes/        Authentication and protected API routes
    db.ts          MongoDB connection
    index.ts       Express entry point and frontend hosting
```

## Local setup

You need Node.js with npm and access to a MongoDB database. Run the following commands from the repository root.

### 1. Install dependencies

```sh
npm install --prefix client
npm install --prefix server
```

### 2. Configure the server

If `server/.env` does not already exist, copy the example:

```sh
cp server/.env.example server/.env
```

Set these values in `server/.env`:

```dotenv
PORT=3000
TOKEN_SECRET=replace-with-your-own-random-secret
DB_USERNAME=your-database-username
DB_PASSWORD=your-database-password
DB_COLLECTION=your-database-name
```

Use your own token secret instead of the example value. Environment files are ignored by Git.

The connection in `server/src/db.ts` reads `DB_USERNAME`, `DB_PASSWORD`, and `DB_COLLECTION` after loading dotenv. Credentials are URL-encoded before inclusion in the URI. The Atlas host is currently fixed in that file; update it to use your own cluster or MongoDB instance. Despite its name, `DB_COLLECTION` selects the **database**, rather than an individual collection. `HOST_IP_ADDRESS` in the example is unused; the server listens on the default interfaces.

### 3. Build and run

The Express server serves the built frontend and API together. This is the current supported local setup:

```sh
npm run build --prefix client
npm run build --prefix server
cd server
npm start
```

Open [http://localhost:3000](http://localhost:3000). Use **Signup** to create an account, then add tasks from the dashboard. The activity page shows task counts and provides logout.

Run the server from the `server` directory so dotenv can locate `server/.env`. Verify that the server logs a successful database connection before using account or task features.

### Development commands

| Directory | Command | Purpose |
| --- | --- | --- |
| `client` | `npm run dev` | Start the Vite development server |
| `client` | `npm run build` | Type-check and build into `client/dist` |
| `client` | `npm run lint` | Run ESLint |
| `client` | `npm run preview` | Preview the frontend build |
| `server` | `npm run dev` | Run the backend with nodemon |
| `server` | `npm run build` | Compile TypeScript into `server/dist` |
| `server` | `npm start` | Run the compiled backend |

The frontend API services use relative `/api/v1/` URLs, so requests go to the same origin that serves the frontend. The server has no CORS middleware and Vite has no API proxy. To use the Vite development server with the backend, configure a Vite proxy for `/api` to your backend. Rebuild the client to see frontend changes when using Express to serve the app.

## API overview

All endpoints use the `/api/v1` prefix. Protected endpoints and logout require the `authtoken` cookie.

| Method | Endpoint | Input / behavior |
| --- | --- | --- |
| POST | `/auth/register` | JSON: `name`, `email`, `password`; creates an account and sets the cookie |
| POST | `/auth/login` | JSON: `name`, `email`, `password`; sets the cookie |
| POST | `/auth/logout` | Clears the authentication cookie |
| GET | `/protected/dashboard` | Checks access to the dashboard |
| GET | `/protected/activity` | Checks access to the activity page |
| GET | `/protected/user` | Returns user data, populated tasks, and statistics, excluding the password |
| POST | `/protected/user/create-task` | JSON: `content`, `status` |
| PATCH | `/protected/user/update-task-content` | JSON: `taskId`, `newContent` |
| PATCH | `/protected/user/update-task-status` | JSON: `taskId`, `newStatus` (`ongoing` or `completed`) |
| DELETE | `/protected/user/delete-task` | Query parameter: `taskId` |

## Current limitations

- The activity page's personal name is a static placeholder; task statistics come from the signed-in user's account.
- There is no token refresh flow; users need to log in again when their token expires.
- Task editing and status updates verify ownership, but the deletion handler currently does not check task ownership.
- No automated test command is configured in either package.
