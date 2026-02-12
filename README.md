# Product Dashboard - Frontend

A modern product management dashboard built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, and **Zustand**. This is the frontend client for the [Product Dashboard API](https://github.com/PathumSandeepa/product-dashboard-api) (Laravel backend).

**Live Demo:** https://product-dashboard-ui-eta.vercel.app

> **Note:** The live demo connects to a backend hosted on Render's free tier. The backend may take 30-60 seconds to wake up on the first request after inactivity. If the dashboard appears empty or login fails, wait a moment and try again.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Key Design Decisions and Assumptions](#key-design-decisions-and-assumptions)
- [API Integration](#api-integration)
- [Authentication Flow](#authentication-flow)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Features

- **User Authentication** - Register, login, logout with JWT-based token management
- **Token Refresh** - Automatic token refresh on 401 responses to maintain sessions
- **Product CRUD** - Create, read, update, and delete products through modal dialogs
- **Server-Side Pagination** - Paginated product listing with navigation controls
- **Search and Filtering** - Filter products by keyword, category, and price range
- **Sorting** - Sort products by price (ascending/descending) and newest first
- **Client-Side Validation** - Form validation on both login/signup and product forms before API calls
- **Server-Side Validation** - Displays backend validation errors mapped to individual fields
- **Responsive Layout** - Mobile-friendly design using Tailwind CSS utility classes
- **Image Fallback** - Graceful fallback placeholder when product images fail to load
- **Persistent Auth State** - Authentication state persisted in localStorage via Zustand

---

## Tech Stack

| Technology                                                  | Version | Purpose                                      |
| ----------------------------------------------------------- | ------- | -------------------------------------------- |
| [Next.js](https://nextjs.org/)                              | 16.1.6  | React framework with App Router              |
| [React](https://react.dev/)                                 | 19.2.3  | UI library                                   |
| [TypeScript](https://www.typescriptlang.org/)               | 5.x     | Static type checking                         |
| [Tailwind CSS](https://tailwindcss.com/)                    | 4.x     | Utility-first CSS framework                  |
| [Zustand](https://zustand-demo.pmnd.rs/)                    | 5.0.11  | Lightweight state management                 |
| [Radix UI](https://www.radix-ui.com/)                       | 1.4.3   | Accessible headless UI primitives            |
| [shadcn/ui](https://ui.shadcn.com/)                         | 3.8.4   | Pre-built component library (New York style) |
| [Lucide React](https://lucide.dev/)                         | 0.563.0 | Icon library                                 |
| [class-variance-authority](https://cva.style/)              | 0.7.1   | Component variant management                 |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 3.4.0   | Tailwind class conflict resolution           |
| [clsx](https://github.com/lukeed/clsx)                      | 2.1.1   | Conditional class name joining               |
| [pnpm](https://pnpm.io/)                                    | latest  | Package manager                              |

---

## Project Structure

```
product-dashboard-ui/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── layout.tsx              # Root layout (Geist font, metadata)
│   │   ├── page.tsx                # Root page (redirects to /login)
│   │   ├── globals.css             # Global styles and Tailwind directives
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Main dashboard (product table, CRUD dialogs)
│   │   ├── login/
│   │   │   └── page.tsx            # Login form with validation
│   │   └── signup/
│   │       └── page.tsx            # Registration form with validation
│   ├── components/
│   │   ├── product-image.tsx       # Image component with error fallback
│   │   ├── layout/
│   │   │   ├── navbar.tsx          # Top navigation bar with profile dropdown
│   │   │   └── footer.tsx          # Page footer
│   │   └── ui/                     # shadcn/ui components
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── field.tsx           # Custom form field with label/error support
│   │       ├── input.tsx
│   │       ├── spinner.tsx
│   │       └── table.tsx
│   ├── lib/
│   │   ├── api.ts                  # API client (fetch wrapper with auth headers)
│   │   ├── types.ts                # TypeScript interfaces and type definitions
│   │   └── utils.ts                # Utility functions (cn, extractFieldErrors)
│   └── store/
│       ├── auth-store.ts           # Zustand store for authentication state
│       └── product-store.ts        # Zustand store for product state
├── components.json                 # shadcn/ui configuration
├── eslint.config.mjs               # ESLint configuration
├── next.config.ts                  # Next.js configuration
├── package.json                    # Dependencies and scripts
├── pnpm-lock.yaml                  # pnpm lockfile
├── pnpm-workspace.yaml             # pnpm workspace configuration
├── postcss.config.mjs              # PostCSS configuration (Tailwind plugin)
└── tsconfig.json                   # TypeScript compiler configuration
```

---

## Prerequisites

- **Node.js** >= 18.x
- **pnpm** (recommended package manager) - Install with `npm install -g pnpm`
- **Laravel Backend** running locally or accessible remotely. See [product-dashboard-api](https://github.com/PathumSandeepa/product-dashboard-api)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/PathumSandeepa/product-dashboard-ui.git
cd product-dashboard-ui
```

### 2. Start the backend first

The frontend depends on the Laravel backend API. Clone and run it before starting the frontend:

```bash
git clone https://github.com/PathumSandeepa/product-dashboard-api.git
cd product-dashboard-api
# Follow the backend README for setup (PHP, Composer, database, etc.)
# The backend runs on http://localhost:8000 by default
```

### 3. Create the environment file

In the **frontend** project root, create a `.env` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This tells the frontend where to send API requests. The variable is prefixed with `NEXT_PUBLIC_` so it is available in the browser at runtime.

### 4. Install dependencies

```bash
pnpm install
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The root path (`/`) automatically redirects to `/login`.

---

## Environment Variables

| Variable              | Required | Default                 | Description                         |
| --------------------- | -------- | ----------------------- | ----------------------------------- |
| `NEXT_PUBLIC_API_URL` | Yes      | `http://localhost:8000` | Base URL of the Laravel backend API |

Create a `.env` file in the project root (this file is gitignored):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, set this to your deployed backend URL (e.g., `https://product-dashboard-api-tusj.onrender.com`).

---

## Available Scripts

| Command      | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| `pnpm dev`   | Start the development server on `http://localhost:3000` with hot reload |
| `pnpm build` | Create an optimized production build in the `.next` directory           |
| `pnpm start` | Start the production server (requires `pnpm build` first)               |
| `pnpm lint`  | Run ESLint to check for code quality issues                             |

---

## Key Design Decisions and Assumptions

### State Management - Zustand over Context API

Zustand was chosen over React Context + useReducer for state management because:

- It provides a simpler API with less boilerplate than Redux or Context-based patterns.
- It works outside of React components (the product store accesses the auth store's token via `useAuthStore.getState()` without being inside a component).
- The `persist` middleware enables automatic localStorage persistence for auth state, so users stay logged in across page refreshes.
- Zustand stores are split by domain: `auth-store.ts` handles authentication, and `product-store.ts` handles product data.

### API Layer - Custom Fetch Wrapper

Instead of using a library like Axios, the project uses a thin `apiFetch` wrapper around the native `fetch` API (`src/lib/api.ts`):

- Centralizes headers (`Content-Type`, `Accept`, `Authorization`) in one place.
- Provides typed responses using generics (`apiFetch<T>`).
- Throws a custom `ApiError` class that carries the HTTP status code and Laravel validation errors (`errors` field), making error handling consistent across stores.
- Keeps the bundle size smaller by avoiding external HTTP libraries.

### Component Library - shadcn/ui with New York Style

UI components are sourced from [shadcn/ui](https://ui.shadcn.com/) using the "New York" style variant:

- Components live in `src/components/ui/` and are fully owned (copied into the project, not imported from a package). This allows full customization.
- Built on top of Radix UI primitives for accessibility (keyboard navigation, screen reader support, focus management).
- A custom `Field` component (`src/components/ui/field.tsx`) wraps form inputs with labels, descriptions, and error messages for consistent form UX.

### Authentication - JWT Bearer Tokens

- The backend issues JWT tokens via `/api/login` and `/api/register`.
- Tokens are stored in Zustand's persisted state (localStorage under the key `auth-storage`).
- Every authenticated API request attaches the token as a `Bearer` header.
- On a 401 response, the product store automatically attempts a token refresh via `/api/refresh`. If refresh fails, the user is redirected to `/login`.

### Client-Side and Server-Side Validation

- **Client-side:** Forms validate inputs before making API calls (e.g., required fields, email format, password length, price range). This provides instant feedback.
- **Server-side:** If the backend returns validation errors (422 status with Laravel's error format), the `extractFieldErrors` utility maps them to individual form fields.
- Both layers display errors inline beneath the corresponding input field.

### Image Handling

The `ProductImage` component (`src/components/product-image.tsx`) uses a native `<img>` tag instead of Next.js `<Image>` because product image URLs come from external sources (user-provided URLs). It includes an `onError` fallback that renders an `ImageOff` icon placeholder when images fail to load.

### Routing and Page Structure

- **App Router** (Next.js 13+ pattern) is used with file-based routing under `src/app/`.
- The root page (`/`) redirects to `/login` using Next.js server-side `redirect()`.
- `/login` and `/signup` are public pages.
- `/dashboard` is the main authenticated page containing the full product table with filters, pagination, and CRUD modals.
- Auth guard logic is handled client-side: if a token refresh fails, the user is redirected to `/login`.

### Assumptions

- The backend API is a Laravel application running the [product-dashboard-api](https://github.com/PathumSandeepa/product-dashboard-api) project.
- The backend exposes RESTful endpoints at `/api/login`, `/api/register`, `/api/logout`, `/api/refresh`, and `/api/products`.
- Products follow the structure: `id`, `title`, `description`, `price`, `category`, `image`, `rating` (with `rate` and `count`).
- Categories are fixed: `men's clothing`, `women's clothing`, `electronics`, `jewelery`.
- The backend handles pagination and returns responses in Laravel's paginated format with `data`, `links`, and `meta` fields.

---

## API Integration

The frontend communicates with the backend through these endpoints:

### Authentication

| Method | Endpoint        | Description                          |
| ------ | --------------- | ------------------------------------ |
| POST   | `/api/register` | Create a new user account            |
| POST   | `/api/login`    | Authenticate and receive a JWT token |
| POST   | `/api/logout`   | Invalidate the current token         |
| POST   | `/api/refresh`  | Refresh an expired JWT token         |

### Products (Authenticated)

| Method | Endpoint             | Description                                     |
| ------ | -------------------- | ----------------------------------------------- |
| GET    | `/api/products`      | List products (paginated, filterable, sortable) |
| POST   | `/api/products`      | Create a new product                            |
| PUT    | `/api/products/{id}` | Update an existing product                      |
| DELETE | `/api/products/{id}` | Delete a product                                |

**Query Parameters for GET `/api/products`:**

| Parameter   | Type   | Description                                  |
| ----------- | ------ | -------------------------------------------- |
| `search`    | string | Search by product title                      |
| `category`  | string | Filter by category                           |
| `min_price` | string | Minimum price filter                         |
| `max_price` | string | Maximum price filter                         |
| `sort`      | string | Sort order (e.g., `price_asc`, `price_desc`) |
| `page`      | number | Page number for pagination                   |

---

## Authentication Flow

```
1. User visits / --> redirected to /login
2. User submits login form
3. Frontend sends POST /api/login with credentials
4. Backend returns { access_token, user }
5. Token and user stored in Zustand (persisted to localStorage)
6. User redirected to /dashboard
7. All subsequent API calls include Authorization: Bearer <token>
8. On 401 response --> attempt POST /api/refresh
9. If refresh succeeds --> retry the original request
10. If refresh fails --> clear auth state, redirect to /login
```

---

## Deployment

### Frontend - Vercel

The Next.js frontend is deployed on [Vercel](https://vercel.com/):

1. **Import the GitHub repository** into Vercel: [github.com/PathumSandeepa/product-dashboard-ui](https://github.com/PathumSandeepa/product-dashboard-ui)
2. Vercel automatically detects:
   - **Framework:** Next.js 16
   - **Build command:** `next build`
   - **Output directory:** `.next`
   - **Package manager:** pnpm (detected from `pnpm-lock.yaml`)
3. **Configure the environment variable** in Vercel's project settings:
   - `NEXT_PUBLIC_API_URL` = `https://product-dashboard-api-tusj.onrender.com`
4. The deployment is connected to the `main` branch with **automatic redeployment** on every push.

**Production URLs:**

- https://product-dashboard-ui-eta.vercel.app

### Backend - Render

The Laravel backend API is deployed on [Render](https://render.com/):

- **Backend URL:** `https://product-dashboard-api-tusj.onrender.com`
- Hosted on Render's **free tier**, which means:
   - The service spins down after periods of inactivity.
   - The first request after inactivity may take 30-60 seconds while the server cold-starts.
   - Occasional timeouts or slow responses may occur.

### Manual Deployment (Vercel CLI)

If you prefer deploying via the CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (follow the prompts)
vercel

# Deploy to production
vercel --prod
```

### Environment Setup Summary

| Environment         | `NEXT_PUBLIC_API_URL`                             | Notes                                    |
| ------------------- | ------------------------------------------------- | ---------------------------------------- |
| Local Development   | `http://localhost:8000`                           | Requires Laravel backend running locally |
| Production (Vercel) | `https://product-dashboard-api-tusj.onrender.com` | Set in Vercel dashboard                  |

---

## Troubleshooting

| Issue                                | Solution                                                                                                                             |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Blank dashboard / no products**    | The Render backend may be cold-starting. Wait 30-60 seconds and refresh.                                                             |
| **Login returns network error**      | Ensure the backend is running. For local dev, verify `http://localhost:8000` is accessible.                                          |
| **CORS errors in console**           | The Laravel backend must have CORS configured to allow requests from `http://localhost:3000` (local) or Vercel domains (production). |
| **`pnpm: command not found`**        | Install pnpm globally: `npm install -g pnpm`                                                                                         |
| **Port 3000 already in use**         | Stop the other process or run `pnpm dev -- -p 3001` to use a different port.                                                         |
| **Environment variable not working** | Ensure the variable is prefixed with `NEXT_PUBLIC_`. Restart the dev server after changing `.env`.                                   |
| **TypeScript errors after pulling**  | Run `pnpm install` to ensure all dependencies are up to date.                                                                        |

---

## License

This project is for educational and demonstration purposes.
