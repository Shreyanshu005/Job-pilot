# JobPilot — Employer Job Portal

A full-stack employer-side job portal built with **Next.js**, **Express.js**, and **MongoDB**. Employers can sign up, set up their company profile, and manage job listings with full CRUD operations.

## 🚀 Features

- **Authentication** — Signup and Login with JWT tokens
- **Account Setup** — Company info, logo upload, contact details
- **Dashboard** — Overview with stats and recent jobs
- **Job Management** — Create, read, update, and delete job listings
- **Search & Pagination** — Find jobs quickly in My Jobs page
- **Loading & Empty States** — Clean UX feedback
- **Animations** — Framer Motion page transitions and micro-interactions
- **Responsive Design** — Works on desktop and mobile

## 🛠 Tech Stack

| Layer     | Technology            |
|-----------|-----------------------|
| Frontend  | Next.js 14, React 18  |
| Backend   | Node.js, Express.js   |
| Database  | MongoDB, Mongoose     |
| Auth      | JWT, bcryptjs         |
| Styling   | Vanilla CSS           |
| Animation | Framer Motion         |
| Icons     | React Icons           |
| HTTP      | Axios                 |

## 📁 Project Structure

```
├── client/                  # Frontend (Next.js)
│   ├── package.json         # Frontend dependencies
│   ├── next.config.js       # Next.js config + API proxy
│   ├── jsconfig.json        # Path aliases
│   └── src/
│       ├── app/
│       │   ├── globals.css  # Design system
│       │   ├── layout.js    # Root layout
│       │   ├── page.js      # Home (redirect)
│       │   ├── login/       # Login page
│       │   ├── signup/      # Signup page
│       │   ├── account-setup/ # Company setup
│       │   └── dashboard/   # Dashboard pages
│       │       ├── layout.js  # Sidebar + header
│       │       ├── page.js    # Overview
│       │       ├── post-job/  # Post new job
│       │       ├── edit-job/  # Edit existing job
│       │       ├── my-jobs/   # All jobs list
│       │       ├── jobs/[id]/ # Job details
│       │       └── profile/   # Employer profile
│       ├── context/
│       │   └── AuthContext.js # Auth state management
│       └── lib/
│           └── api.js       # Axios API client
│
├── server/                  # Backend API
│   ├── index.js             # Express entry point
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Job.js           # Job schema
│   ├── routes/
│   │   ├── auth.js          # Auth endpoints
│   │   ├── jobs.js          # Job CRUD endpoints
│   │   └── employer.js      # Profile endpoints
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   └── uploads/             # Logo uploads
│
├── .gitignore
└── README.md
```

## ⚙️ Setup & Run

### Prerequisites

- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd assign
```

### 2. Install dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Configure environment

Create `server/.env`:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/jobpilot
JWT_SECRET=your_secret_key
```

### 4. Start MongoDB

```bash
mongod
```

### 5. Start the backend

```bash
cd server
node index.js
```

### 6. Start the frontend (in a new terminal)

```bash
cd client
npm run dev
```

### 7. Open in browser

Visit [http://localhost:3000](http://localhost:3000)

## 📡 API Endpoints

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | /api/auth/signup      | Register user       |
| POST   | /api/auth/login       | Login user          |
| GET    | /api/auth/me          | Get current user    |
| GET    | /api/jobs             | List employer jobs  |
| GET    | /api/jobs/:id         | Get single job      |
| POST   | /api/jobs             | Create job          |
| PUT    | /api/jobs/:id         | Update job          |
| DELETE | /api/jobs/:id         | Delete job          |
| GET    | /api/employer/profile | Get profile         |
| PUT    | /api/employer/profile | Update profile      |
| POST   | /api/employer/logo    | Upload logo         |

## 🎨 Design

The UI follows the provided Figma design:
- Clean, professional aesthetic with purple (#6C63FF) accent color
- Split-layout auth pages with team collaboration imagery
- Dashboard with sidebar navigation and stats cards
- Jobs table with status badges, application counts, and action menus
- Account setup with logo upload and company info form
