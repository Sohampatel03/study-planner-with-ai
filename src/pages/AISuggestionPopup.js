import React from "react";

const AISuggestionPopup = ({ suggestedTask, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-black">
        <h3 className="text-lg font-semibold mb-4">AI Suggested Task</h3>

        <div className="mb-2">
          <label className="block text-gray-700 mb-1">Suggested Description:</label>
          <p className="p-2 border rounded-md bg-gray-100">{suggestedTask.suggestedDescription}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Suggested Duration:</label>
          <p className="p-2 border rounded-md bg-gray-100">{suggestedTask.suggestedDuration} minutes</p>
        </div>

        <div className="flex justify-between">
          <button 
            onClick={onAccept} 
            className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Accept
          </button>

          <button 
            onClick={onReject} 
            className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionPopup;
