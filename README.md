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
| Deployment | Frontend → Render, Backend → Vercel |

## Project Structure

```
Pyro/
├── backend/
│   ├── controllers/     # auth, games, cart, wishlist, orders, admin, user
│   ├── middlewares/     # JWT auth middleware
│   ├── model/           # Mongoose schemas (User, Game, Cart, Wishlist, Order, Comment)
│   ├── nodemailer/      # Email templates and sending logic
│   ├── routes/          # Express route definitions
│   ├── utils/           # JWT generation, passport config, token utils
│   └── index.js         # Express app entry point
├── frontend/
│   └── src/
│       ├── components/  # Navbar, Banner, GameSlider, FlashSale, etc.
│       ├── pages/       # Home, Login, Register, Cart, Wishlist, GamesDetails, etc.
│       ├── store/       # Zustand stores (auth, cart, wishlist)
│       ├── skeletonLoader/ # Skeleton loading states
│       └── App.jsx      # Routes
└── assets/
    └── poster/          # Game poster images
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- RAWG API key ([rawg.io](https://rawg.io/apidocs))
- Google OAuth credentials
- Resend or SMTP credentials for email

### Backend Setup

```bash
cd Pyro
npm install
```

Create a `.env` file in the root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

RAWG_API_KEY=your_rawg_api_key
BASE_URL=https://api.rawg.io/api/games

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLIENT_URL=http://localhost:5173

# Email (Resend or SMTP)
RESEND_API_KEY=your_resend_api_key
```

```bash
npm start    # runs with nodemon on port 3000
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev  # runs on http://localhost:5173
```

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
