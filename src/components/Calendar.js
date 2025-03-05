import React, { useState } from "react";

const Calendar = ({ tasks }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Get today's date
  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();

  // Function to handle date click
  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-2/3">
      <h2 className="text-lg font-bold text-white mb-4">Calendar</h2>

      {/* Upper Section: Calendar Grid */}
      <div className="bg-gray-700 p-4 rounded-md">
        <h3 className="text-white text-center mb-2">
          {currentMonth} {currentYear}
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(daysInMonth)].map((_, index) => {
            const day = index + 1;
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`p-2 rounded-md ${
                  selectedDate === day ? "bg-blue-500" : "bg-gray-600"
                } text-white hover:bg-blue-400`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lower Section: Task List for Selected Date */}
      <div className="mt-4 bg-gray-700 p-4 rounded-md">
        <h3 className="text-white mb-2">Tasks for {selectedDate || "Select a date"}</h3>
        <ul className="text-white">
          {selectedDate && tasks[selectedDate] ? (
            tasks[selectedDate].map((task, index) => (
              <li key={index} className="bg-gray-600 p-2 rounded-md mb-2">
                {task}
              </li>
            ))
          ) : (
            <p className="text-gray-400">No tasks for this date.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Calendar;
