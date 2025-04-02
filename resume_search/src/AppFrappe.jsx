import React, { useState } from 'react';
import SearchForm from './components/search/SearchForm';
import EmploymentDetails from './components/employment/EmploymentDetails';
import EducationDetails from './components/education/EducationDetails';
import DiversityDetails from './components/diversity/DiversityDetails';
import './App.css'
import { FrappeProvider } from 'frappe-react-sdk'


function App() {
    // State for search form
	const [searchKeywords, setSearchKeywords] = useState('');
	const [minExperience, setMinExperience] = useState('');
	const [maxExperience, setMaxExperience] = useState('');
	const [location, setLocation] = useState('');
	
	// State for active tab
	const [activeTab, setActiveTab] = useState('search');
	
	// Handle search submission
	const handleSearch = () => {
	  console.log('Searching with parameters:', {
		keywords: searchKeywords,
		experience: `${minExperience}-${maxExperience} years`,
		location
	  });
	  // In a real application, this would trigger an API call
	};

  return (
	<div className="App">
	  <FrappeProvider>
	  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Left column - Search forms */}
          <div className="md:w-3/3 space-y-6">
            <div className="flex space-x-4 border-b">
              <button 
                className={`pb-2 font-medium ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('search')}
              >
                Search candidates
              </button>
              <button 
                className={`pb-2 font-medium ${activeTab === 'saved' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('saved')}
              >
                Saved Notes
              </button>
            </div>
            
            {activeTab === 'search' && (
              <>
                <SearchForm 
                  searchKeywords={searchKeywords}
                  setSearchKeywords={setSearchKeywords}
                  minExperience={minExperience}
                  setMinExperience={setMinExperience}
                  maxExperience={maxExperience}
                  setMaxExperience={setMaxExperience}
                  location={location}
                  setLocation={setLocation}
                />
                <EmploymentDetails />
                <EducationDetails />
                <DiversityDetails />
                
                <div className="flex justify-between items-center mt-4 mb-8">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Active in:</span>
                    <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                      <option>6 months</option>
                      <option>3 months</option>
                      <option>1 month</option>
                    </select>
                  </div>
                  
                  <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
                    onClick={handleSearch}
                  >
                    Search candidates
                  </button>
                </div>
              </>
            )}
            
            {activeTab === 'saved' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Saved Notes</h2>
                <p className="text-gray-600">You don't have any saved notes yet.</p>
              </div>
            )}
          </div>

        </div>
      </main>
	  </FrappeProvider>
	</div>
  )
}

export default App
