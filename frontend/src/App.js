
import './App.css';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskProgress from './components/TaskProgress';
import Calendar from './components/Calendar';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import AddTask from './pages/AddTask';
import TaskDetails from './pages/TaskDetails';
import AISearchBar from './components/AISearchBar';
import AiSuggestedTask from './pages/AiSuggestedTask';
import TimerPage from './pages/TimerPage';
import axios from "axios";
import Login from "./pages/Login";
import Register from "./pages/Register";

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("https://study-planner-with-ai-1.onrender.com/user",  {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,  // Ensure "Bearer " is included
        },
      })
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null); // Ensure the user state updates correctly
        });
    }
  }, []);
  
  const handleAddTask = () => {
    console.log("Add Task Clicked!");
  };
  return (
    <AuthContext.Provider value={{ user, setUser }}>
    <BrowserRouter>
       <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4 md:p-6 pt-12 sm:pt-14 md:pt-16">
        {/* Header Section */}
        <Header onAddTask={handleAddTask} />
        {/* <AISearchBar /> */}

        {/* Main Layout */}
        <Routes>
          <Route path="/" element={user ?
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 mt-2 sm:mt-4 md:mt-6">
              <TaskProgress completed={10} remaining={23}/>
              <TaskList />
              <Calendar/> 
            </div> : <Navigate to="/login"/>
          } />
          <Route path="/login" element={user ? <Navigate to="/"/> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/add-task" element={user ? <AddTask /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={user ? <Calendar /> : <Navigate to="/login" />} />
          <Route path="/task/:id" element={user ? <TaskDetails /> : <Navigate to="/login" />} />
          <Route path="/timer/:id" element={user ? <TimerPage /> : <Navigate to="/login" />} />
        <Route path="/ai-suggested-task" element={user ? <AiSuggestedTask /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
