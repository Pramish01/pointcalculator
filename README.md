# Event & Team Management Platform

A full-stack web application for managing events and teams with user authentication and profile management.

## Features

- User Authentication with Email Verification (Sign up, Login, Logout)
- Admin Approval System (New users must be approved by admin)
- Event Management (Create, Edit, Delete events with color customization)
- Team Management (Create, Edit, Delete teams with player management)
- User Profile with statistics
- Event Dashboard (Upcoming and Ongoing events)
- Search functionality for teams
- Admin Dashboard for user management

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
4. Go to the SQL Editor and run the migration files in order:
   - **First**, open `backend/migrations/001_initial_schema.sql`
   - Copy and paste the entire content into the SQL Editor
   - Click "Run" to create all tables
   - **Then**, open `backend/migrations/003_integrate_supabase_auth.sql`
   - Copy and paste the entire content into the SQL Editor
   - Click "Run" to integrate with Supabase Auth
5. **Configure Email Verification** (Authentication > Email Templates):
   - Go to Authentication > Settings in your Supabase Dashboard
   - Scroll to "Email Auth" section
   - Ensure "Enable email confirmations" is **ON**
   - Optionally customize the email templates under "Email Templates"
   - Set your "Site URL" (e.g., `http://localhost:5173` for development)
6. **Create the first admin user**:
   - First, register through your app (you'll receive a verification email)
   - Click the verification link in the email
   - Then, in the SQL Editor, run:
   ```sql
   UPDATE users
   SET is_admin = TRUE, status = 'approved'
   WHERE email = 'your-email@example.com';
   ```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### 1. Start the Backend Server

**Option 1: Using the start script (Linux/Mac):**
```bash
cd backend
./start.sh
```

**Option 2: Using npm (if .env is properly configured):**
```bash
cd backend
npm run dev
```

**Option 3: On Windows PowerShell (if .env isn't loading):**
```powershell
cd backend
$env:PORT="5000"; $env:SUPABASE_URL="your_supabase_url"; $env:SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"; $env:JWT_SECRET="your_jwt_secret"; npm run dev
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
- `POST /api/auth/register` - Register new user (Supabase sends verification email)
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/login` - Login user (requires verified email and admin approval)
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

### Registration & Login Flow
1. **Sign Up**: Users create an account with name, email, and password
2. **Email Verification**: Supabase Auth automatically sends verification email
3. **Admin Approval**: After email verification, admin must approve the account
4. **Login**: Users can login only after email verification and admin approval
- Authentication powered by Supabase Auth (built-in email verification)
- Passwords securely managed by Supabase Auth
- JWT tokens are used for API authentication (30-day expiration)
- Admin approval system adds an extra security layer

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
