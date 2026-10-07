# Biryani By Brothers — Frontend

React + Vite storefront for Biryani By Brothers.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

## Environment

```bash
# Leave empty in local dev (uses Vite proxy /api → backend :5000)
VITE_API_URL=
```

Production:

```bash
VITE_API_URL=https://your-api-domain.com/api
```

## State management

Redux Toolkit (`@reduxjs/toolkit` + `react-redux`):

- `src/store/` — store, slices, bootstrap
- Slices: `auth`, `adminAuth`, `catalog`, `cart`, `order`
- Existing hooks (`useAuth`, `useCart`, `useCatalog`, …) still work as thin Redux wrappers

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite |
| `npm run build` | Production build |
| `npm run preview` | Preview build |

## Auth / cart notes

- Guest can browse menu and use cart
- Checkout, account, orders require login
- Cart is stored in `localStorage` (`bbb_cart`) and survives login

Backend API lives in a separate repository (`backend/`).
