// frontend/src/components/Calendar.js
// FINAL COMPLETE VERSION - COPY THIS ENTIRE FILE

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Get number of days in month
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  // Handle date click
  const handleDateClick = (day) => {
    const selectedFullDate = new Date(currentYear, currentMonth, day).toLocaleDateString("en-CA");
    setSelectedDate(selectedFullDate);
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Go to today
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(today.toLocaleDateString("en-CA"));
  };

  // Create set of dates that have tasks
  const taskDates = new Set(
    tasks.map((task) => new Date(task.date).toISOString().split("T")[0])
  );

  // Get task count for a specific date
  const getTaskCountForDate = (dateKey) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date).toISOString().split("T")[0];
      return taskDate === dateKey;
    }).length;
  };

  // Check if a day is today
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
  const totalSlots = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-700/50 w-full mx-auto mt-5 backdrop-blur-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={goToPreviousMonth}
            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className="text-xl sm:text-2xl font-bold text-white min-w-[200px] text-center">
            {months[currentMonth]} {currentYear}
          </h2>
          
          <button
            onClick={goToNextMonth}
            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button
          onClick={goToToday}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
        >
          <span>📅</span>
          <span>Today</span>
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs sm:text-sm font-semibold text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="bg-gray-900/50 p-3 sm:p-4 rounded-xl border border-gray-700/50 mb-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {[...Array(totalSlots)].map((_, index) => {
              const dayNumber = index - firstDayOfMonth + 1;
              const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
              const dateKey = isValidDay 
                ? new Date(currentYear, currentMonth, dayNumber).toLocaleDateString("en-CA")
                : null;
              const hasTask = isValidDay && taskDates.has(dateKey);
              const taskCount = isValidDay ? getTaskCountForDate(dateKey) : 0;
              const isTodayDate = isValidDay && isToday(dayNumber);
              const isSelected = dateKey === selectedDate;

              return (
                <button
                  key={index}
                  onClick={() => isValidDay && handleDateClick(dayNumber)}
                  disabled={!isValidDay}
                  className={`relative aspect-square p-2 rounded-lg text-sm sm:text-base transition-all duration-200 ${
                    !isValidDay
                      ? 'invisible'
                      : isSelected
                      ? 'bg-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-400'
                      : isTodayDate
                      ? 'bg-purple-600/50 text-white font-bold ring-2 ring-purple-400'
                      : hasTask
                      ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border border-yellow-500/50'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {isValidDay && (
                    <>
                      <span className="block">{dayNumber}</span>
                      {taskCount > 0 && (
                        <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                          {taskCount}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-600 rounded border-2 border-purple-400"></div>
          <span className="text-gray-400">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500/20 border border-yellow-500/50 rounded"></div>
          <span className="text-gray-400">Has Tasks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span className="text-gray-400">Selected</span>
        </div>
      </div>

      {/* Tasks for Selected Date */}
      <div className="bg-gray-900/50 p-4 sm:p-6 rounded-xl border border-gray-700/50">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="text-xl">📋</span>
          <span>
            Tasks for {selectedDate 
              ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'Select a date'
            }
          </span>
        </h3>

        {selectedDate ? (
          tasks.filter((task) => {
            const taskDate = new Date(task.date).toISOString().split("T")[0];
            return taskDate === selectedDate;
          }).length > 0 ? (
            <ul className="space-y-3">
              {tasks
                .filter((task) => {
                  const taskDate = new Date(task.date).toISOString().split("T")[0];
                  return taskDate === selectedDate;
                })
                .map((task) => (
                  <li
                    key={task._id}
                    className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium flex-1">{task.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {task.status || 'pending'}
                      </span>
                    </div>
                    
                    {task.duration && (
                      <p className="text-gray-400 text-sm mb-3 flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{task.duration} minutes</span>
                      </p>
                    )}
                    
                    <Link
                      to={`/task/${task._id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <span>View Details</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-400">No tasks scheduled for this date</p>
            </div>
          )
        ) : (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">👆</div>
            <p className="text-gray-400">Select a date to view tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;