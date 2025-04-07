import React from 'react';
import Cookies from 'js-cookie';
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

              <img src="/assets/resumeparser/resume_search/resume.svg" className='h-10 w-10 mx-5' alt="Icon" />
                Resume Finder
                sid :  {Cookies.get('sid')} 
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="ml-10 flex space-x-8">
              <a href="/resume_search/search" className="border-b-2 border-blue-500 text-gray-900 px-1 pt-1 text-sm font-medium">
                  Search Job & Respose
              </a>

              <a href="/resume_search/results" className="border-b-2 border-blue-500 text-gray-900 px-1 pt-1 text-sm font-medium">
                ResDesk
              </a>

              {/* <a href="/resume_search/detail/testbyjay" className="border-b-2 border-blue-500 text-gray-900 px-1 pt-1 text-sm font-medium">
                Candidate Resume Details
              </a> */}
              
            </nav>
          </div>
          
          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white text-sm font-medium py-1 px-3 rounded-md flex items-center">
              <span className="ml-1 text-xs">Hello {Cookies.get('full_name')} </span>
            </button>

            <button onClick={(e) => { e.preventDefault(); fetch('/api/method/logout').then(() => window.location.href = '/login'); }} className="bg-red-600 text-white text-sm font-medium py-1 px-3 rounded-md flex items-center">
              <span className="ml-1 text-xs">Logout</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
