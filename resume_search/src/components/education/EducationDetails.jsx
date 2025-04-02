import React, { useState } from 'react';

const EducationDetails = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Education Details</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="space-y-4">
          {/* UG Qualification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">UG Qualification</label>
            <div className="flex space-x-2">
              <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">Any UG qualification</button>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Specific UG qualification</button>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">No UG qualification</button>
            </div>
          </div>
          
          {/* Choose Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Choose Course</label>
            <input 
              type="text" 
              placeholder="Type or select UG course from list" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Institute */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institute</label>
            <input 
              type="text" 
              placeholder="Select institute" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Education Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Education Type</label>
            <div className="flex space-x-2">
              <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center">
                Full Time
                <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Part Time</button>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Correspondence</button>
            </div>
          </div>
          
          {/* Year of degree completion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year of degree completion</label>
            <div className="flex items-center space-x-2">
              <select className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>From</option>
                {[...Array(30)].map((_, i) => (
                  <option key={i} value={2025 - i}>{2025 - i}</option>
                ))}
              </select>
              <span className="text-gray-500">To</span>
              <select className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>To</option>
                {[...Array(30)].map((_, i) => (
                  <option key={i} value={2025 - i}>{2025 - i}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* PG Qualification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PG Qualification</label>
            <div className="flex space-x-2">
              <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">Any PG qualification</button>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Specific PG qualification</button>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">No PG qualification</button>
            </div>
          </div>
          
          {/* Add PPG/Doctorate Qualification */}
          <div>
            <button className="text-blue-600 text-sm font-medium flex items-center">
              <span className="mr-1">+</span> Add PPG/Doctorate Qualification
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationDetails;
