import React, { useState } from "react";

const GptSearchBar = () => {
  const [responseText, setResponseText] = useState("");

  const handleGptSearchClick = async () => {
    try {
      const res = await fetch("https://study-planner-with-ai-1.onrender.com/api/ai-suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is being added here
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      
      // ✅ Log API response in frontend console
      console.log("AI Response:", data.response);

      setResponseText(data.response || "No response received.");
    } catch (error) {
      console.error("Error fetching AI suggestion:", error);
      setResponseText("Error fetching AI response.");
    }
  };

  return (
    <div className="pt-[20%] sm:pt-[15%] md:pt-[10%] flex flex-col items-center px-4">
      <form className="w-full sm:w-3/4 md:w-1/2 bg-black grid grid-cols-12" onSubmit={(e) => e.preventDefault()}>
        <button className="py-2 px-2 sm:px-4 bg-red-700 text-white rounded-lg col-span-3 m-2 sm:m-4 text-xs sm:text-sm md:text-base" onClick={handleGptSearchClick}>
          Get AI Response
        </button>
      </form>
      {responseText && <p className="text-white mt-4 text-sm sm:text-base px-4">{responseText}</p>}
    </div>
  );
};

export default GptSearchBar;
