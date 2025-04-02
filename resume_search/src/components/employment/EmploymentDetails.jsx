import React, { useState } from 'react';

const EmploymentDetails = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Employment Details</h2>
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
          {/* Department and Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department and Role</label>
            <input 
              type="text" 
              placeholder="Add Department and Role" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input 
              type="text" 
              placeholder="Add Industry" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input 
              type="text" 
              placeholder="Add Company name" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="mt-2 flex items-center">
              <span className="text-xs text-gray-500 mr-2">Boosted off</span>
              <button className="relative inline-flex items-center h-5 rounded-full w-10 bg-gray-200">
                <span className="absolute h-4 w-4 left-1 bg-white rounded-full"></span>
              </button>
            </div>
            
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Search in Current company</span>
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <input 
              type="text" 
              placeholder="Add designation" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="mt-2 flex items-center">
              <span className="text-xs text-gray-500 mr-2">Boosted off</span>
              <button className="relative inline-flex items-center h-5 rounded-full w-10 bg-gray-200">
                <span className="absolute h-4 w-4 left-1 bg-white rounded-full"></span>
              </button>
            </div>
            
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Search in Current designation</span>
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Notice Period / Availability to join */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period / Availability to join</label>
            <div className="flex flex-wrap gap-2">
              <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">Any</button>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">0-15 days</button>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">1 month</button>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">2 months</button>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">3 months</button>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">More than 3 months</button>
            </div>
            
            <div className="mt-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">Currently serving notice period</span>
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmploymentDetails;
