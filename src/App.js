
import './App.css';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskProgress from './components/TaskProgress';
import Calendar from './components/Calendar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AddTask from './pages/AddTask';

function App() {
  const [tasks, setTasks] = useState({
    1: ["Complete UI Design", "Submit Assignment"],
    5: ["Workout", "Team Meeting"],
    10: ["Grocery Shopping"],
  });

  const handleAddTask = () => {
    console.log("Add Task Clicked!");
  };
  return (
    <BrowserRouter>
       <div className="min-h-screen bg-gray-900 text-white p-6">
        {/* Header Section */}
        <Header onAddTask={handleAddTask} />

        {/* Main Layout */}
        <Routes>
          <Route path="/" element={
            <div className="grid grid-cols-3 gap-4 mt-6">
              <TaskProgress />
              <TaskList   tasks={tasks} />
              <Calendar tasks={tasks} />
            </div>
          } />
          <Route path="/add-task" element={<AddTask />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
