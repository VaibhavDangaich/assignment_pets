# PetEvents

## Project Overview

**PetEvents** is a **Next.js 16** full-stack pet services platform where users can:
- Browse and book pet **events** (training, adoption, meetups, competitions)
- Find and book **service providers** (veterinarians, groomers, trainers)
- **Subscribe** to get exclusive discounts on events and services

## Project Architecture

```
assignment_pets/
├── app/                    # Next.js App Router (pages & API routes)
│   ├── api/               # Backend API endpoints
│   │   ├── events/        # Events CRUD
│   │   ├── services/      # Service providers CRUD
│   │   ├── bookings/      # User bookings
│   │   └── subscriptions/ # Subscription management
│   ├── layout.js          # Root layout with AuthProvider & Navbar
│   ├── page.js            # Homepage
│   └── globals.css        # Global styles
├── components/            # Reusable React components
├── models/                # Mongoose schemas (MongoDB)
├── lib/                   # Utility functions (DB connection)
├── middleware.js          # Clerk authentication middleware
└── seed/                  # Database seeding scripts
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19 |
| **Authentication** | Clerk (`@clerk/nextjs`) |
| **Database** | MongoDB with Mongoose |
| **Styling** | CSS Modules + CSS Variables |
| **Package Manager** | npm |

## Authentication Flow

- Clerk Provider wraps the entire app
- Middleware protects routes
- Public routes: `/`, `/events`, `/services`, `/sign-in`, `/sign-up`, `/api/events`, `/api/services`
- Protected routes: `/bookings`, `/subscription`, `/api/bookings`, `/api/subscriptions`

## Database Models

| Model | Purpose |
|-------|---------|
| **User** | User profile, pets array, subscription status |
| **Event** | Pet events (training, adoption, meetup, competition) |
| **ServiceProvider** | Vets, groomers, trainers with services list |
| **Booking** | User bookings for events/services |
| **Subscription** | Monthly/yearly subscription plans |

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/events` | GET | ❌ | List all events (with filters) |
| `/api/events` | POST | ❌ | Create new event |
| `/api/events/[id]` | GET | ❌ | Get single event details |
| `/api/services` | GET | ❌ | List all service providers |
| `/api/services/[id]` | GET | ❌ | Get single provider details |
| `/api/bookings` | GET | ✅ | Get user's bookings |
| `/api/bookings` | POST | ✅ | Create a booking |
| `/api/subscriptions` | GET | ✅ | Get user's subscription |
| `/api/subscriptions` | POST | ✅ | Create/activate subscription |

## Complete User Flow

1. **Landing Page** (`/`) - Hero section, latest events/services, subscription banner
2. **Browse Events** (`/events`) - List with filtering by type
3. **Browse Services** (`/services`) - Service providers list
4. **User Authentication** - Sign up/Sign in via Clerk
5. **Book Event/Service** (Protected) - Booking stored in MongoDB
6. **Subscribe** (`/subscription`) - Monthly ($9.99) / Yearly ($99.99)
7. **View Bookings** (`/bookings`) - User's booking history

## Key UI Components

| Component | Purpose |
|-----------|---------|
| `Navbar` | Navigation with auth state |
| `EventCard` | Event display card with discount badge |
| `ServiceCard` | Provider card with rating stars |
| `SubscriptionBanner` | CTA for non-subscribers |
| `AuthProvider` | Wraps app with Clerk context |

## Quick Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Seed database
npm run seed

# Build for production
npm run build
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB connection string
MONGODB_URI=your_mongodb_connection_string

# Clerk authentication keys
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables (see above)
4. Seed the database: `npm run seed`
5. Run the development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000) in your browser
