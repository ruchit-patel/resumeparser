import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-blue-600 font-bold text-2xl flex items-center h-full w-full">
                {/* <svg className="h-8 w-8 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2" />
                </svg> */}

              <img src="/resume.svg" className='h-10 w-10 mx-5' alt="Icon" />
                Resume Parser
              </div>
            </div>
            
            {/* Navigation */}
            {/* <nav className="ml-10 flex space-x-8">
              <a href="#" className="border-b-2 border-blue-500 text-gray-900 px-1 pt-1 text-sm font-medium">
                Jobs & Responses
              </a>
              <a href="#" className="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 px-1 pt-1 text-sm font-medium">
                Recruiter
              </a>
              <a href="#" className="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 px-1 pt-1 text-sm font-medium">
                Analytics
              </a>
            </nav> */}
          </div>
          
          {/* Right side icons */}
          {/* <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-100 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <button className="bg-blue-600 text-white text-sm font-medium py-1 px-3 rounded-md flex items-center">
              <span>naukri</span>
              <span className="ml-1 text-xs">talent cloud</span>
            </button>
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
