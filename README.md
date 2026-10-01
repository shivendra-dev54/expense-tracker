# Expense Tracker

Expense Tracker is a full-stack web application for managing personal expenses with multiple entry books, category-like expense logs, user authentication, and administrative controls. It is built with Next.js and uses MongoDB for persistence.

The app allows users to create accounts, maintain separate expense books, log spending entries with notes, and manage their data securely through authenticated API routes.

## Features

- User sign up and sign in
- JWT-based authentication with secure cookie handling
- Expense book creation and management
- Add, update, and delete expense entries
- View entries for a selected book
- User profile access and self-deletion flow
- Admin-only access to user management
- Responsive UI with Tailwind CSS
- MongoDB-backed data persistence

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- MongoDB
- Mongoose
- Bun
- jose
- bcryptjs
- Zustand
- Axios

## Project Structure

```text
expense-tracker/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── app/
│   │   ├── auth/
│   │   └── page.tsx
│   ├── Components/
│   ├── db/
│   ├── services/
│   ├── Store/
│   ├── Types/
│   ├── util/
│   └── proxy.ts
├── api.readme.md
├── docker-compose.yaml
├── Dockerfile
├── next.config.ts
├── package.json
├── tsconfig.json
├── README.md
└── public/
```

## Prerequisites

Before running the app, make sure you have the following installed:

- Node.js 20+
- Bun
- MongoDB instance or MongoDB Atlas connection

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_jwt_secret
ADMIN_SECRET=your_admin_secret
```

If you are using Docker Compose, the app reads the `.env` file automatically via the compose configuration.

## Getting Started

1. Install dependencies:

```bash
bun install
```

2. Start the development server:

```bash
bun run dev
```

3. Open the app in your browser:

```text
http://localhost:3000
```

## Production Build

```bash
bun run build
bun run start
```

## Docker Setup

You can also run the project with Docker:

```bash
docker compose up --build
```

The app is configured to expose port 3000.

## API Overview

The project includes a set of REST API endpoints for authentication, books, expenses, users, and admin operations.

For detailed request and response examples, see [api.readme.md](api.readme.md).

## Main Modules

### Authentication

- Sign up
- Sign in
- Refresh token
- Logout

### Expense Books

- Create book
- Get books
- Update book name
- Delete book

### Expenses

- Add expense to a book
- Get expenses for a book
- Update expense amount or note
- Delete expense

### Admin

- Verify admin access using a secret key
- List users
- Delete user records

## Notes

This project uses the App Router architecture in Next.js and keeps route-level business logic in the service layer. It follows a simple layered pattern:

- UI components for interaction
- API routes for HTTP endpoints
- Services for database logic
- Mongo models and schemas for persistence

## Author

Built by [shivendra devadhe](https://github.com/shivendra-dev54).
