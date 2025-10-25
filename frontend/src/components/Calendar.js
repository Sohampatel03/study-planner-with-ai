import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchTasks = async () => {
        try {
          console.log("Token from localStorage calender:", localStorage.getItem("token"));
          const response = await fetch("https://study-planner-with-ai-1.onrender.com/tasks", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
  
          if (!response.ok) {
            throw new Error("Failed to fetch tasks");
          }
  
          const data = await response.json();
          setTasks(data);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
    };
    fetchTasks();
  }, []);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const handleDateClick = (day) => {
    const selectedFullDate = new Date(currentYear, currentMonth, day)
      .toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
    setSelectedDate(selectedFullDate);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    if (currentMonth === 0) setCurrentYear((prevYear) => prevYear - 1);
  };

  const goToNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    if (currentMonth === 11) setCurrentYear((prevYear) => prevYear + 1);
  };

  // Create a set of task dates for quick lookup
  const taskDates = new Set(
    tasks.map((task) => new Date(task.date).toISOString().split("T")[0])
  );

  return (
    <div className="bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg shadow-lg w-full mx-auto mt-2 sm:mt-3 md:mt-5">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <button onClick={goToPreviousMonth} className="bg-gray-600 text-white px-2 sm:px-3 py-1 rounded-md hover:bg-gray-500 text-sm sm:text-base">
          ←
        </button>
        <h2 className="text-sm sm:text-base md:text-lg font-bold text-white">
          {months[currentMonth]} {currentYear}
        </h2>
        <button onClick={goToNextMonth} className="bg-gray-600 text-white px-2 sm:px-3 py-1 rounded-md hover:bg-gray-500 text-sm sm:text-base">
          →
        </button>
      </div>

      <div className="bg-gray-700 p-2 sm:p-3 md:p-4 rounded-md">
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {[...Array(getDaysInMonth(currentMonth, currentYear))].map((_, dayIndex) => {
            const day = dayIndex + 1;
            const dateKey = new Date(currentYear, currentMonth, day).toLocaleDateString("en-CA");

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`p-1 sm:p-2 rounded-md text-xs sm:text-sm transition-colors ${
                  selectedDate === dateKey
                    ? "bg-blue-500" // Selected date
                    : taskDates.has(dateKey)
                    ? "bg-yellow-400" // Highlighted date with tasks
                    : "bg-gray-600"
                } text-white hover:bg-blue-400`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 sm:mt-4 md:mt-6 bg-gray-700 p-2 sm:p-3 md:p-4 rounded-md">
        <h3 className="text-white mb-2 text-sm sm:text-base">
          Tasks for {selectedDate ? selectedDate : "Select a date"}
        </h3>
        <ul className="text-white space-y-1 sm:space-y-2">
          {selectedDate &&
          tasks.filter((task) => {
            const taskDate = new Date(task.date).toISOString().split("T")[0];
            return taskDate === selectedDate;
          }).length > 0 ? (
            tasks
              .filter((task) => {
                const taskDate = new Date(task.date).toISOString().split("T")[0];
                return taskDate === selectedDate;
              })
              .map((task) => (
                <li key={task._id} className="bg-gray-600 p-2 rounded-md">
                  <Link to={`/task/${task._id}`} className="text-blue-400 hover:underline text-xs sm:text-sm">
                    <strong>{task.title}</strong>
                  </Link>
                </li>
              ))
          ) : (
            <p className="text-gray-400 text-xs sm:text-sm">No tasks for this date.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Calendar;
