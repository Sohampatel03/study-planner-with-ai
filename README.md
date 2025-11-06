Study Planner with AI

Study Planner with AI is a smart study management web application designed to help students plan tasks, track progress, schedule study sessions, and enhance learning with AI-powered study recommendations. Each user has their own private set of tasks and data.

[🔗 Live Demo](https://study-planner-with-ai.vercel.app/)

View Live Demo

✨ Features
Feature	Description
User Authentication	Secure signup and login with JWT.
Task Management	Add, edit, delete tasks with name, description, date & time duration.
AI-Powered Suggestions	Gemini AI suggests improved descriptions + learning resources.
Progress Tracking	Timer-based task completion updates dynamic progress ring.
Calendar View	Highlights task schedule to visualize upcoming study sessions.
Task Detail Timer	Start study timer; updates remaining and completed progress automatically.
User Data Isolation	Each user sees only their own tasks and study progress.
🔄 Application Workflow

User Signup / Signin

Users create an account or log in securely using JWT authentication.

Task Creation

Add a new task with:

Task Name

Task Description

Task Date

Target Study Time (Duration)

AI Enhancement (Gemini AI)

Based on Task Name, AI generates:

Improved Task Description

Study Tips & Learning Resources (videos, articles, notes)

Users can:

✅ Accept AI Recommendation

❌ Keep Original Description

Task Detail Page & Timer

Start a study timer for each task.

When time completes:

Progress circle updates dynamically.

Completed vs Remaining study time is visually highlighted.

Calendar Tracking

Calendar highlights scheduled task dates.

Clicking a date shows tasks for that day.

🧠 Simplified Flow
Signup/Login → Create Task → AI Suggests Better Description →
Accept/Reject AI → Start Timer → Progress Updates → Calendar Highlights Tasks

🗂️ Folder Structure
Study-Planner-AI/
│
├── frontend/        # React.js + Tailwind CSS (Create React App)
└── backend/         # Node.js + Express + MongoDB + JWT

🛠️ Tech Stack
Frontend

React.js (Create React App)

Tailwind CSS

Backend

Node.js

Express.js

Mongoose (MongoDB ORM)

JWT Authentication

Gemini AI API Integration

Database

MongoDB Atlas (Cloud)

🚀 Local Development Setup
Clone Repository
git clone https://github.com/yourusername/study-planner-ai.git
cd study-planner-ai

Frontend Setup
cd frontend
npm install
npm start

Backend Setup
cd backend
npm install
npm install --global nodemon
nodemon server.js

Configure Environment Variables

Create .env file inside backend/:

MONGO_URI = your_mongodb_atlas_url
JWT_SECRET = your_secret_key
GEMINI_API_KEY = your_gemini_api_key
PORT = 5000

🤝 Contributing

Contributions are welcome!
Open an issue or submit a pull request to improve the project.
