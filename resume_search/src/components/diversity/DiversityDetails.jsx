import React, { useState } from 'react';

const DiversityDetails = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Diversity and Additional Details</h2>
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
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Diversity details</h3>
            
            {/* Gender */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex space-x-2">
                <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">All candidates</button>
                <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Male candidates</button>
                <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Female candidates</button>
              </div>
            </div>
            
            {/* Show only candidates who */}
            <div className="mb-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="diversity-checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="diversity-checkbox" className="ml-2 block text-sm text-gray-700">
                  Show only candidates who
                </label>
              </div>
            </div>
            
            {/* Candidate Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Category</label>
              <input 
                type="text" 
                placeholder="Add candidate category" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Candidate Age */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Age</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  placeholder="Min age" 
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">to</span>
                <input 
                  type="text" 
                  placeholder="Max age" 
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">Years</span>
              </div>
            </div>
          </div>
          
          {/* Work details */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Work details</h3>
            
            {/* Show candidates seeking */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Show candidates seeking</label>
              <div className="flex space-x-2">
                <select className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option>Job type</option>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                </select>
                <select className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option>Employment type</option>
                  <option>Permanent</option>
                  <option>Temporary</option>
                </select>
              </div>
            </div>
            
            {/* Work permit for */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Work permit for</label>
              <input 
                type="text" 
                placeholder="Choose category" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Display details */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Display details</h3>
            
            {/* Show */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Show</label>
              <div className="flex space-x-2">
                <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">All candidates</button>
                <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">New registrations</button>
                <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Modified candidates</button>
              </div>
            </div>
            
            {/* Show only candidates with */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Show only candidates with</label>
              <div className="flex space-x-2">
                <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center">
                  Verified mobile number
                  <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center">
                  Verified email ID
                  <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center">
                  Attached resume
                  <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiversityDetails;
