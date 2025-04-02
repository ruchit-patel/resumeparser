import React, { useState } from 'react';

const SearchForm = ({ 
  searchKeywords, 
  setSearchKeywords, 
  minExperience, 
  setMinExperience, 
  maxExperience, 
  setMaxExperience,
  location,
  setLocation
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Search candidates</h2>
      
      {/* Keywords */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
        <input 
          type="text" 
          placeholder="Enter keywords like skills, designation and company" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={searchKeywords}
          onChange={(e) => setSearchKeywords(e.target.value)}
        />
      </div>
      
      {/* Experience */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Experience</h3>
        <div className="flex items-center space-x-2">
          <input 
            type="text" 
            placeholder="Min experience" 
            className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={minExperience}
            onChange={(e) => setMinExperience(e.target.value)}
          />
          <span className="text-gray-500">to</span>
          <input 
            type="text" 
            placeholder="Max experience" 
            className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={maxExperience}
            onChange={(e) => setMaxExperience(e.target.value)}
          />
          <span className="text-gray-500">Years</span>
        </div>
      </div>
      
      {/* Current location */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Current location of candidate</h3>
        <input 
          type="text" 
          placeholder="Add location" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        
        {/* Location checkboxes */}
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="include-candidates" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="include-candidates" className="ml-2 block text-sm text-gray-700">
              Include candidates who prefer to relocate to above locations
            </label>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="exclude-candidates" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="exclude-candidates" className="ml-2 block text-sm text-gray-700">
              Exclude candidates who have mentioned these locations in...
            </label>
          </div>
        </div>
      </div>
      
      {/* Annual Salary */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Annual Salary</h3>
        <div className="flex items-center space-x-2">
          <select className="w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option>INR</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
          <input 
            type="text" 
            placeholder="Minimum" 
            className="w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-gray-500">to</span>
          <input 
            type="text" 
            placeholder="Maximum" 
            className="w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-gray-500">Lacs</span>
        </div>
        
        {/* Salary checkbox */}
        <div className="mt-2">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="include-salary" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="include-salary" className="ml-2 block text-sm text-gray-700">
              Include candidates who did not mention their current salary
            </label>
          </div>
        </div>
      </div>
      
      {/* Add IT Skills button */}
      <div className="mb-4">
        <button className="text-blue-600 text-sm font-medium flex items-center hover:text-blue-800">
          <span className="mr-1">+</span> Add IT Skills
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
