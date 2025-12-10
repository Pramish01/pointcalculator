# Project Structure - Complete File Organization

## 📁 Root Directory
```
pointcalculator/
├── .gitignore                    # Git ignore file
├── README.md                     # Main documentation
├── index.html                    # Root HTML (legacy)
├── backend/                      # Backend server (Node.js/Express)
└── frontend/                     # Frontend app (React/Vite)
```

---

## 🔧 Backend Directory (`/backend`)

### Configuration Files
- **package.json** - Node.js dependencies and scripts
- **.env** - Environment variables (MongoDB URI, JWT secret)
- **.env.example** - Example environment variables

### JavaScript Files (Node.js/Express)

#### **Server**
- `server.js` - Main Express server entry point

#### **Configuration** (`config/`)
- `db.js` - MongoDB connection configuration

#### **Models** (`models/`) - Mongoose Schemas
- `User.js` - User model (name, email, password, profilePicture)
- `Event.js` - Event model (name, date, colors, status)
- `Team.js` - Team model with nested player schema

#### **Controllers** (`controllers/`) - Business Logic
- `authController.js` - Register, login, getProfile
- `eventController.js` - CRUD operations for events
- `teamController.js` - CRUD operations for teams
- `statsController.js` - User statistics

#### **Routes** (`routes/`) - API Endpoints
- `authRoutes.js` - /api/auth/* routes
- `eventRoutes.js` - /api/events/* routes
- `teamRoutes.js` - /api/teams/* routes
- `statsRoutes.js` - /api/stats/* routes

#### **Middleware** (`middleware/`)
- `auth.js` - JWT authentication middleware

---

## 🎨 Frontend Directory (`/frontend`)

### Configuration Files
- **package.json** - React dependencies and scripts
- **vite.config.js** - Vite configuration
- **eslint.config.js** - ESLint configuration
- **index.html** - HTML entry point

### JavaScript/JSX Files (`src/`)

#### **Main Files**
- `main.jsx` - React app entry point
- `App.jsx` - Main app component with routing

#### **Pages** (`pages/`) - Full Page Components
- `Login.jsx` - Login page with form
- `Signup.jsx` - Signup page with form
- `Home.jsx` - Home dashboard with events
- `Profile.jsx` - User profile with stats
- `Teams.jsx` - Team management page

#### **Components** (`components/`) - Reusable Components
- `ProtectedRoute.jsx` - Route protection wrapper
- `EventCard.jsx` - Event display card
- `EventForm.jsx` - Event create/edit modal
- `TeamCard.jsx` - Team display card
- `TeamForm.jsx` - Team create/edit modal with players

#### **Context** (`context/`) - State Management
- `AuthContext.jsx` - Authentication context & provider

#### **Utils** (`utils/`) - Utility Functions
- `api.js` - Axios API calls (eventAPI, teamAPI, statsAPI)

### CSS Files (`src/styles/`)
- `Login.css` - Login/Signup page styles
- `Home.css` - Home page styles
- `Profile.css` - Profile page styles
- `Teams.css` - Teams page styles
- `EventCard.css` - Event card styles
- `EventForm.css` - Event form modal styles
- `TeamCard.css` - Team card styles
- `TeamForm.css` - Team form modal styles

### Global CSS
- `src/App.css` - Global app styles
- `src/index.css` - Base CSS reset

### Assets (`public/` & `src/assets/`)
- `public/vite.svg` - Vite logo
- `src/assets/react.svg` - React logo

---

## 📋 File Organization by Language

### JavaScript (Node.js) - Backend
```
backend/
├── server.js
├── config/db.js
├── controllers/
│   ├── authController.js
│   ├── eventController.js
│   ├── statsController.js
│   └── teamController.js
├── middleware/auth.js
├── models/
│   ├── Event.js
│   ├── Team.js
│   └── User.js
└── routes/
    ├── authRoutes.js
    ├── eventRoutes.js
    ├── statsRoutes.js
    └── teamRoutes.js
```

### JavaScript/JSX (React) - Frontend
```
frontend/src/
├── main.jsx
├── App.jsx
├── components/
│   ├── EventCard.jsx
│   ├── EventForm.jsx
│   ├── ProtectedRoute.jsx
│   ├── TeamCard.jsx
│   └── TeamForm.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   ├── Signup.jsx
│   └── Teams.jsx
├── context/
│   └── AuthContext.jsx
└── utils/
    └── api.js
```

### CSS Stylesheets
```
frontend/src/
├── App.css
├── index.css
└── styles/
    ├── EventCard.css
    ├── EventForm.css
    ├── Home.css
    ├── Login.css
    ├── Profile.css
    ├── TeamCard.css
    ├── TeamForm.css
    └── Teams.css
```

### HTML Files
```
frontend/
└── index.html (Vite entry point)
```

### Environment Files
```
backend/
├── .env (your local config - not committed)
└── .env.example (template)
```

### Configuration Files (JSON)
```
backend/package.json
frontend/package.json
frontend/vite.config.js
frontend/eslint.config.js
```

---

## 🚀 How to Open in VS Code

1. **Open the project:**
   ```bash
   cd /home/user/pointcalculator
   code .
   ```

2. **Or open specific directories:**
   ```bash
   code backend    # Open backend only
   code frontend   # Open frontend only
   ```

3. **Recommended VS Code Extensions:**
   - ES7+ React/Redux/React-Native snippets
   - ESLint
   - Prettier
   - MongoDB for VS Code
   - Thunder Client (for API testing)

---

## 📝 Quick Reference

### Backend Files Purpose
| File | Purpose |
|------|---------|
| `server.js` | Express server setup |
| `models/*.js` | Database schemas |
| `controllers/*.js` | Business logic |
| `routes/*.js` | API endpoints |
| `middleware/auth.js` | JWT validation |

### Frontend Files Purpose
| File | Purpose |
|------|---------|
| `pages/*.jsx` | Full page views |
| `components/*.jsx` | Reusable UI pieces |
| `styles/*.css` | Component styling |
| `context/AuthContext.jsx` | User authentication state |
| `utils/api.js` | HTTP requests |

All files are now ready to edit in VS Code!
