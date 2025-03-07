import React, { useState } from "react";

const GptSearchBar = () => {
  const [responseText, setResponseText] = useState("");

  const handleGptSearchClick = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <div className="pt-[50%] md:pt-[10%] flex flex-col items-center">
      <form className="w-full md:w-1/2 bg-black grid grid-cols-12" onSubmit={(e) => e.preventDefault()}>
        <button className="py-2 px-4 bg-red-700 text-white rounded-lg col-span-3 m-4" onClick={handleGptSearchClick}>
          Get AI Response
        </button>
      </form>
      {responseText && <p className="text-white mt-4">{responseText}</p>}
    </div>
  );
};

export default GptSearchBar;
