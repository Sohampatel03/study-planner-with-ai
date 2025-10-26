// frontend/src/pages/Register.js (Enhanced Version)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters!" });
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://study-planner-with-ai-1.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: "success", text: "Account created successfully! Redirecting to login..." });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage({ type: "error", text: data.message || "Registration failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Connection error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 
      flex items-center justify-center p-4 overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br 
            from-purple-500 to-blue-600 rounded-2xl mb-4 text-3xl">
            ✨
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join StudyPlanner AI</h1>
          <p className="text-gray-400">Create your account and start learning smarter</p>
        </div>

        {/* Register Card */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md 
          p-8 rounded-2xl shadow-2xl border border-gray-700/50">
          
          {/* Message Alert */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}>
              <span className="text-2xl">{message.type === "success" ? "✅" : "❌"}</span>
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-white font-medium text-sm flex items-center gap-2">
                <span>👤</span>
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl 
                  text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                  focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-white font-medium text-sm flex items-center gap-2">
                <span>📧</span>
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl 
                  text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                  focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-white font-medium text-sm flex items-center gap-2">
                <span>🔒</span>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl 
                    text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                    focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 
                    hover:text-white transition-colors"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-white font-medium text-sm flex items-center gap-2">
                <span>🔐</span>
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl 
                  text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                  focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  <div className={`h-1 flex-1 rounded-full ${
                    password.length >= 6 ? 'bg-green-500' : 'bg-gray-700'
                  }`}></div>
                  <div className={`h-1 flex-1 rounded-full ${
                    password.length >= 8 ? 'bg-green-500' : 'bg-gray-700'
                  }`}></div>
                  <div className={`h-1 flex-1 rounded-full ${
                    password.length >= 10 && /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-700'
                  }`}></div>
                </div>
                <p className="text-xs text-gray-400">
                  Password strength: {
                    password.length >= 10 && /[A-Z]/.test(password) ? 'Strong' :
                    password.length >= 8 ? 'Good' :
                    password.length >= 6 ? 'Fair' : 'Weak'
                  }
                </p>
              </div>
            )}

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" required className="w-4 h-4 mt-1 rounded" />
              <label className="text-gray-400">
                I agree to the{" "}
                <button type="button" className="text-purple-400 hover:text-purple-300">
                  Terms of Service
                </button>
                {" "}and{" "}
                <button type="button" className="text-purple-400 hover:text-purple-300">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 
                flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" 
                    fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" 
                      strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white transition-colors flex items-center 
              justify-center gap-2 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;