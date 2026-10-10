# Pyro 🎮

A full-stack game store web application where users can browse, wishlist, and purchase PC games. Built as a college project.

## Features

**User**
- Register with email/password (with email verification via OTP)
- Login with Google OAuth or email/password
- Forgot/reset password via email link
- Profile page

**Store**
- Browse hundreds of games sourced from the RAWG API
- Filter by genre, top rated, flash sale, under ₹500, under ₹1000
- Search games
- Game detail pages with screenshots, trailer, system requirements, and ratings
- Free games section

**Shopping**
- Add games to cart and wishlist
- Checkout with payment method selection
- Order confirmation email sent on purchase
- View order history

**Admin Dashboard**
- View, manage, and delete users
- View, update pricing, and delete games
- View all orders across the platform

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v7 |
| State | Zustand |
| Animations | Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (cookies), Passport.js (Google OAuth 2.0), bcryptjs |
| Email | Nodemailer, Resend |
| Game Data | RAWG Video Games API |
| Deployment | Single service (Express serves the API **and** the built React app) — Render / any Docker host |

## Project Structure

```
Pyro/
├── backend/
│   ├── controllers/     # auth, games, cart, wishlist, orders, admin, user
│   ├── middlewares/     # JWT auth + admin password guard
│   ├── model/           # Mongoose schemas (User, Game, Cart, Wishlist, Order, Comment)
│   ├── nodemailer/      # Email templates and sending logic (Resend or SMTP)
│   ├── routes/          # Express route definitions
│   ├── scripts/         # seed.js - import games / fix poster paths
│   ├── utils/           # JWT generation, passport config, poster map
│   └── index.js         # Express entry: API + posters + serves frontend/dist
├── frontend/
│   └── src/
│       ├── components/  # Navbar, Banner, GameSlider, FlashSale, etc.
│       ├── pages/       # Home, Login, Register, Cart, Wishlist, GamesDetails, etc.
│       ├── store/       # Zustand stores (auth, cart, wishlist)
│       ├── skeletonLoader/ # Skeleton loading states
│       └── App.jsx      # Routes
├── assets/
│   └── poster/          # Game poster images (served at /assets/poster/*)
├── Dockerfile           # builds UI + server into one image
├── render.yaml          # Render blueprint
├── .env.example         # backend environment template
└── DEPLOYMENT.md        # step-by-step deployment guide
```

## Deploying

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for the full guide (MongoDB Atlas, Render,
Docker, email, Google login, troubleshooting). The short version:

```bash
npm ci && npm run build   # installs + builds the React app into frontend/dist
npm start                 # one Node process serves API + UI on $PORT
```

## Local Development

### Prerequisites

- Node.js 20+
- MongoDB instance (local or Atlas)
- RAWG API key ([rawg.io](https://rawg.io/apidocs)) - only to import games
- Google OAuth credentials (optional)
- Resend or SMTP credentials for email

### Backend

```bash
npm install
cp .env.example .env     # fill in MONGO_URI, JWT_SECRET, ... (see the file)
npm run seed             # one-time: import ~200 games from RAWG
npm run dev              # nodemon on http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

No frontend `.env` is needed locally: Vite proxies `/api` and `/assets` to
`http://localhost:3000`. (`VITE_BACKEND_URL` is only for hosting the frontend
separately - see [DEPLOYMENT.md](DEPLOYMENT.md).)

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/verify-email` | Verify email OTP |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password/:token` | Reset password |
| GET | `/api/auth/google` | Google OAuth login |
| GET | `/api/games` | Get all games |
| GET | `/api/games/:gameId` | Get game details |
| GET | `/api/games/top-rated` | Top rated games |
| GET | `/api/games/flash-sale` | Flash sale games |
| GET | `/api/games/under-price-500` | Games under ₹500 |
| GET | `/api/games/under-price-1000` | Games under ₹1000 |
| GET | `/api/games/genre/:genre` | Games by genre |
| GET | `/api/games/browse-games` | Browse all games |
| GET/POST/DELETE | `/api/cart` | Cart operations |
| GET/POST/DELETE | `/api/wishlist` | Wishlist operations |
| POST | `/api/orders/checkout` | Place order |
| GET | `/api/orders/:userId` | Get user orders |
| POST | `/api/orders/confirm-email` | Send order confirmation email |
| GET | `/api/admin/users` | (Admin) Get all users |
| DELETE | `/api/admin/users/:userId` | (Admin) Delete user |
| GET | `/api/admin/games` | (Admin) Get all games |
| PATCH | `/api/admin/games/:gameId` | (Admin) Update game |
| DELETE | `/api/admin/games/:gameId` | (Admin) Delete game |
| GET | `/api/admin/orders` | (Admin) Get all orders |
