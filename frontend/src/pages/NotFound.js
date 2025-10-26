// frontend/src/pages/NotFound.js
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 
      text-white flex items-center justify-center p-4 overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 Text */}
        <div className="relative">
          <h1 className="text-9xl md:text-[200px] font-bold bg-gradient-to-r from-blue-400 
            via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 text-9xl md:text-[200px] font-bold 
            bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
            bg-clip-text text-transparent blur-2xl opacity-30">
            404
          </div>
        </div>

        {/* Emoji Animation */}
        <div className="text-6xl md:text-8xl my-8 animate-bounce">
          🤔
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          The page you're looking for seems to have gone on a study break.
          <br />
          Let's get you back on track!
        </p>

        {/* Countdown */}
        <div className="mb-8">
          <p className="text-gray-400 mb-2">Redirecting in</p>
          <div className="inline-flex items-center justify-center w-16 h-16 
            bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-2xl font-bold">
            {countdown}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 
              rounded-xl font-semibold text-lg transition-all duration-300 
              hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm 
              border border-white/20 rounded-xl font-semibold text-lg 
              transition-all duration-300 hover:scale-105"
          >
            Go Back
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
          <h3 className="text-xl font-semibold mb-4">Suggested Pages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <PageLink onClick={() => navigate('/')} icon="🏠" text="Home" />
            <PageLink onClick={() => navigate('/dashboard')} icon="📊" text="Dashboard" />
            <PageLink onClick={() => navigate('/add-task')} icon="➕" text="Add Task" />
            <PageLink onClick={() => navigate('/calendar')} icon="📅" text="Calendar" />
          </div>
        </div>
      </div>
    </div>
  );
}

const PageLink = ({ onClick, icon, text }) => (
  <button
    onClick={onClick}
    className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all 
      duration-200 hover:scale-105 border border-gray-700 hover:border-blue-500/50"
  >
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-sm font-medium">{text}</div>
  </button>
);

export default NotFound;