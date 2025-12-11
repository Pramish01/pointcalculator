# Event & Team Management Platform

A full-stack web application for managing events and teams with user authentication and profile management.

## Features

- User Authentication (Sign up, Login, Logout)
- Event Management (Create, Edit, Delete events with color customization)
- Team Management (Create, Edit, Delete teams with player management)
- User Profile with statistics
- Event Dashboard (Upcoming and Ongoing events)
- Search functionality for teams

## Tech Stack

### Frontend
- React with Vite
- React Router for navigation
- Axios for API calls
- CSS for styling

### Backend
- Node.js with Express
- Supabase (PostgreSQL)
- JWT for authentication
- bcryptjs for password hashing

## Prerequisites

- Node.js (v14 or higher)
- Supabase account (free tier available)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd pointcalculator
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

**Setting up Supabase:**

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings > API
   - Copy the "Project URL" to `SUPABASE_URL`
   - Copy the "service_role" key to `SUPABASE_SERVICE_ROLE_KEY` (under "Project API keys")
4. Go to the SQL Editor and run the migration file:
   - Open `backend/migrations/001_initial_schema.sql`
   - Copy and paste the entire content into the SQL Editor
   - Click "Run" to create all tables

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

### 2. Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Application Structure

### Frontend (`/frontend`)
```
src/
├── components/       # Reusable components
├── pages/           # Page components
├── context/         # React context (Auth)
├── utils/           # Utility functions (API calls)
└── styles/          # CSS files
```

### Backend (`/backend`)
```
├── config/          # Supabase configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware (auth)
├── migrations/      # Database SQL migrations
└── routes/          # API routes
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Events
- `GET /api/events` - Get all user events (protected)
- `GET /api/events/:id` - Get event by ID (protected)
- `POST /api/events` - Create new event (protected)
- `PUT /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)

### Teams
- `GET /api/teams` - Get all user teams (protected)
- `GET /api/teams/:id` - Get team by ID (protected)
- `GET /api/teams/search?keyword=...` - Search teams (protected)
- `POST /api/teams` - Create new team (protected)
- `PUT /api/teams/:id` - Update team (protected)
- `DELETE /api/teams/:id` - Delete team (protected)

### Stats
- `GET /api/stats` - Get user statistics (protected)

### Admin (Admin Only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/pending` - Get pending approval users
- `PUT /api/admin/users/:id/approve` - Approve user
- `PUT /api/admin/users/:id/reject` - Reject user
- `DELETE /api/admin/users/:id` - Delete user

## Features Walkthrough

### Login/Signup
- Users can create an account or login with existing credentials
- Passwords are securely hashed using bcryptjs
- JWT tokens are used for authentication

### Home Page
- View all events (upcoming and ongoing)
- Quick access to create new events
- Navigate to team management and profile

### Event Management
- Create events with custom colors
- Upload event logos via URL
- Set event dates
- Edit and delete existing events

### Team Management
- Create teams with players
- Add multiple players to each team
- Search teams by name or tag
- Edit and delete teams

### Profile
- View user information
- See statistics (total teams created, total events hosted)
- Logout functionality

## License

MIT
