# ⚡ CodeReviewer AI

A full-stack, AI-powered application that acts as your personal senior developer. It instantly analyzes your code, provides a score, detects bugs, and offers rewritten, improved code snippets.

## 🚀 Features
- **Instant Code Reviews:** Powered by Groq's LLaMA-3.1-8b model for ultra-low latency responses.
- **Premium UI/UX:** A "Claude-inspired" interface with smooth Dark/Light mode transitions, glassmorphism, and responsive design.
- **Smart Text Input:** Auto-expanding chat boxes that adapt as you type long blocks of code.
- **Robust Backend Parsing:** Custom 3-layer text-parser built in Node.js to guarantee the AI's review is always perfectly structured.
- **Secure Authentication:** Full JWT session management with HTTP-only cookies and token blacklisting for secure logouts.
- **Chat History:** MongoDB integration to securely save and retrieve all your past code reviews.

## 🛠️ Tech Stack
- **Frontend:** React.js, Custom Vanilla CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI Integration:** Groq API (LLaMA-3.1-8b-instant)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs

## 📂 Project Structure

```text
CODEAI/
├── BackEnd/                    # Express.js Server
│   ├── api/                    # Vercel Serverless Entrypoint
│   │   └── index.js            
│   ├── src/                    
│   │   ├── config/             # MongoDB connection (database.js)
│   │   ├── controllers/        # Request logic (auth, ai, review)
│   │   ├── middlewares/        # JWT validation & Security guards
│   │   ├── models/             # Mongoose Schemas (user, history, blacklist)
│   │   ├── routes/             # Express API Endpoints
│   │   ├── services/           # External API calls (Groq AI logic)
│   │   └── app.js              # Express application setup
│   ├── vercel.json             # Backend Vercel deployment config
│   └── server.js               # Local development entry
│
└── client/                     # React.js Frontend
    ├── src/                    
    │   ├── components/         # Reusable UI (Navbar, Footer, ProtectedRoute)
    │   ├── context/            # React Global State (AuthContext, ThemeContext)
    │   ├── pages/              # Main App Views (Landing, Login, Register, Chat, History)
    │   ├── services/           # Axios interceptors & API wrappers
    │   ├── styles/             # Vanilla CSS design system (theme.css)
    │   ├── App.jsx             # React Router routing logic
    │   └── main.jsx            # React DOM Entry
    ├── index.html              
    ├── vite.config.js          
    └── vercel.json             # Frontend Vercel SPA routing config
```

## 🧠 System Architecture & Logic

Building the backend logic for this application was designed around security, speed, and reliable AI formatting. Here is how the core systems work:

### Authentication & Security (Auth Controller & Models)
The system uses a highly secure, stateless authentication flow:
- **User Model:** Stores user credentials with passwords heavily encrypted via `bcryptjs`.
- **Login/Register Flow:** Upon login, the `auth.controller.js` generates a secure JSON Web Token (JWT) and attaches it to an **HTTP-only cookie**. This prevents XSS attacks since the token cannot be accessed via frontend JavaScript.
- **Secure Logout:** When a user logs out, the backend doesn't just clear the cookie. The token is explicitly stored in a `Blacklist Model` in MongoDB. Any future requests with that specific token are automatically rejected by the auth middleware, ensuring complete session termination.

### AI Processing & Fallback Parsing (AI Service & Controller)
LLMs are powerful but can sometimes output broken formatting or fail to escape strings properly. To solve this, the `ai.service.js` acts as a robust middleman:
1. **Prompt Engineering:** The controller formats the user's code and injects strict system instructions telling the LLaMA-3.1 model exactly how to structure its response (Score, Summary, Issues, Improved Code).
2. **Context Awareness:** If the user is asking a follow-up question, the controller fetches previous messages from the `History Model` and sends them to the Groq API to maintain conversational memory.
3. **Custom 3-Layer Parser:** Since the AI might return messy markdown instead of a strict format, the backend runs the raw response through a custom text-parsing algorithm. It intelligently extracts the `TITLE` and the `MESSAGE` bodies, guaranteeing that the frontend always receives perfectly structured data to render without crashing.

### Chat History Management (History Model)
Every interaction is permanently saved to the database:
- The `history.model.js` stores an array of messages tied to specific `reviewIds` and the authenticated user's ID.
- The `review.controller.js` seamlessly handles fetching past conversations, allowing users to jump back into an old code review exactly where they left off.
