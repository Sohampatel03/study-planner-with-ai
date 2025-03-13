# Study Planner with AI

## Overview

Study Planner with AI is a task management web application that helps users organize their study schedules efficiently. It features task tracking, a progress dashboard, a calendar for scheduling, and AI-based study recommendations.

## Features

- **Task Management**: Add, edit, and delete study tasks.
- **Progress Tracking**: View completed and pending tasks with visual indicators.
- **Calendar Integration**: Schedule tasks and track deadlines.
- **AI-Powered Recommendations**: Get personalized study suggestions.
- **User Authentication**: Secure login and logout functionality.

---

## Folder Structure

The project is divided into two main parts: `frontend` (React) and `backend` (Node.js with Express).

### 📂 Project Structure

study-planner-with-ai/ ├── frontend/ # Frontend (React) │ ├── public/ # Static assets │ ├── src/
│ │ ├── assets/ # Images, icons, styles │ │ ├── components/ # Reusable UI components │ │ ├── pages/ # Pages (Dashboard, Login, etc.) │ │ ├── context/ # Context API for global state │ │ ├── hooks/ # Custom hooks │ │ ├── services/ # API calls │ │ ├── utils/ # Helper functions │ │ ├── App.js # Main App component │ │ ├── index.js # Entry point │ ├── .env # Environment variables │ ├── package.json # Dependencies │ ├── tailwind.config.js # Tailwind CSS configuration │ ├── vite.config.js # Vite configuration │ └── README.md # Frontend documentation │ ├── backend/ # Backend (Node.js & Express) │ ├── src/ │ │ ├── config/ # Database & environment config │ │ ├── controllers/ # API controllers │ │ ├── models/ # Mongoose models │ │ ├── routes/ # API routes │ │ ├── middleware/ # Authentication & validation │ │ ├── services/ # Business logic & AI integration │ │ ├── utils/ # Utility functions │ │ ├── app.js # Express application setup │ ├── .env # Environment variables │ ├── package.json # Dependencies │ ├── server.js # Entry point │ └── README.md # Backend documentation


---

## 🚀 Setup Instructions

### 1️⃣ Frontend Setup

```sh
cd frontend
npm install
npm run dev


cd backend
npm install
npm start

🛠️ Technologies Used
Frontend:
React.js
Tailwind CSS
Vite
Backend:
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
🤝 Contributing
Feel free to submit issues or create pull requests. Contributions are always welcome!