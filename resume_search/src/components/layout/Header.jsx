import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const navigate = useNavigate();
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

              <div className="flex items-center cursor-pointer" onClick={() => {window.location.href = '/app/resume-list';}}>
                <img src="/assets/resumeparser/resume_search/resume.svg" className='h-10 w-10 mx-5' alt="Icon" />
                <span>Resume Finder</span>
              </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="ml-10 flex space-x-8">
              <button
                onClick={() => navigate('/resume_search/search')}
                className="border-b-2 border-blue-500 text-gray-900 px-1 pt-1 text-sm font-medium">
                Search Resumes
              </button>

              <button
                onClick={() => navigate('/resume_search/upload')}
                className="border-b-2 border-blue-500 text-gray-900 px-1 pt-1 text-sm font-medium">
                Upload Resume
              </button>

              {/* <button
                onClick={() => navigate('/resume_search/results')}
                className="border-b-2 border-blue-500 text-gray-900 px-1 pt-1 text-sm font-medium">
                ResDesk
              </button> */}

            </nav>
          </div>
          
          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white text-sm font-medium py-1.5 px-4 rounded-md flex items-center hover:shadow-md">
              <span className="ml-1 text-xs font-semibold">Hello {Cookies.get('full_name')} </span>
            </button>

            <button 
              onClick={async () => {
                await fetch('/api/method/logout');
                window.location.href = `/login?redirect-to=${window.location.pathname}`;
              }} 
              className="bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white text-sm font-medium py-1.5 px-4 rounded-md flex items-center hover:shadow-md">
              <span className="ml-1 text-xs font-semibold">Logout</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
