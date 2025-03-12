import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const handleDateClick = (day) => {
    const selectedFullDate = new Date(currentYear, currentMonth, day)
      .toLocaleDateString("en-CA"); // Format as YYYY-MM-DD correctly
    setSelectedDate(selectedFullDate);
  };
  

  const goToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    console.log("Cohere API Key:", process.env.COHERE_API_KEY);
    if (currentMonth === 0) setCurrentYear((prevYear) => prevYear - 1);
  };

  const goToNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    if (currentMonth === 11) setCurrentYear((prevYear) => prevYear + 1);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-3/4 mx-auto mt-5 h[screen]">
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousMonth} className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-500">
          ←
        </button>
        <h2 className="text-lg font-bold text-white">
          {months[currentMonth]} {currentYear}
        </h2>
        <button onClick={goToNextMonth} className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-500">
          →
        </button>
      </div>

      <div className="bg-gray-700 p-4 rounded-md">
        <div className="grid grid-cols-7 gap-2">
          {[...Array(getDaysInMonth(currentMonth, currentYear))].map((_, dayIndex) => {
            const day = dayIndex + 1;
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`p-2 rounded-md text-sm ${
                  selectedDate === new Date(currentYear, currentMonth, day).toLocaleDateString("en-CA")
                    ? "bg-blue-500"
                    : "bg-gray-600"
                } text-white hover:bg-blue-400`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 bg-gray-700 p-4 rounded-md">
        <h3 className="text-white mb-2">
          Tasks for {selectedDate ? selectedDate : "Select a date"}
        </h3>
        <ul className="text-white">
  {selectedDate &&
    tasks.filter((task) => {
      // Extract YYYY-MM-DD from task.date
      const taskDate = new Date(task.date).toISOString().split("T")[0];
      return taskDate === selectedDate;
    }).length > 0 ? (
      tasks
        .filter((task) => {
          const taskDate = new Date(task.date).toISOString().split("T")[0];
          return taskDate === selectedDate;
        })
        .map((task) => (
          <li key={task._id} className="bg-gray-600 p-2 rounded-md mb-2">
            <Link to={`/task/${task._id}`} className="text-blue-400 hover:underline">
              <strong>{task.title}</strong>
            </Link>
          </li>
        ))
    ) : (
      <p className="text-gray-400">No tasks for this date.</p>
    )}
</ul>
      </div>
    </div>
  );
}

export default Calendar;
