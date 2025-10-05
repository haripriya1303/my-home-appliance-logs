# Home Appliance Tracker - Monorepo

This project has been restructured as a monorepo with separate packages for frontend and backend.

## Project Structure

```
.
├── packages/
│   ├── frontend/          # React frontend application
│   └── backend/           # Express.js backend API
├── package.json           # Root package with workspace configuration
├── README.md              # This file
└── ...                    # Other root-level configuration files
```

## Packages

### Frontend
The frontend is a React application built with Vite, TypeScript, and Shadcn UI components.

### Backend
The backend is an Express.js API with TypeScript, Drizzle ORM, and PostgreSQL database.

## Development

To start both frontend and backend in development mode:

```bash
npm run dev
```

To start only the frontend:

```bash
npm run dev:frontend
```

To start only the backend:

```bash
npm run dev:backend
```

## Building

To build both packages:

```bash
npm run build
```

To build only the frontend:

```bash
npm run build:frontend
```

To build only the backend:

```bash
npm run build:backend
```

## Database

To generate database migrations:

```bash
npm run db:generate
```

To apply database migrations:

```bash
npm run db:migrate
```

To seed the database:

```bash
npm run db:seed
```

## Verification

To verify that the monorepo is correctly implemented and all packages build successfully:

```bash
node verify-monorepo.js
```

This script will:
1. Check that workspaces are configured correctly
2. Verify that both frontend and backend packages exist
3. Build each package individually
4. Build all packages together