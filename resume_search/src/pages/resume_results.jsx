import React, { useState, useEffect } from "react";
import CandidateCard from "../components/resumeCard/CandidateCardComponent";
import { config } from "@/config"
import { useLocation } from 'react-router-dom'; 

// Sample data - in a real app, this would come from an API
const fetchSearchData = async (data) => {
  try {
    console.log("Search Query Data:", data);

    // Get CSRF token from meta tag (usually present in Frappe templates)
    const csrfToken = window.csrf_token;

    console.log("CSRF Token:", csrfToken);

    const response = await fetch(`/api/method/resumeparser.apis.search_apis.search_results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': csrfToken,
      },
      credentials: 'include', // important to send cookies
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Search Result:", result);
    return result;
  } catch (error) {
    console.error('Error in fetchSearchData:', error);
    return null;
  }
};

const ResumeFindPage = () => {
  const location = useLocation();
  const searchData = location.state?.searchData;
  const jobPostId = searchData?.jobPostId;
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [allCandidatesData, setAllCandidatesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };


  useEffect(() => {
    if (searchData) {
      console.log("Search data received:", searchData);
      setIsLoading(true);
      fetchSearchData(searchData)
        .then((response) => {
          if (response && response.message) {
            setAllCandidatesData(response.message);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [searchData]);

  const handleSelectCandidate = (id, selected) => {
    if (selected) {
      setSelectedCandidates((prev) => [...prev, id]);
    } else {
      setSelectedCandidates((prev) => prev.filter((cid) => cid !== id));
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* RIGHT SIDE - RESULTS */}
        <div className="w-full space-y-4">
        {/* <div className="w-full lg:w-3/5 xl:w-3/4 space-y-4"> */}
          {/* Results count and pagination */}
          <div className="bg-white rounded-md shadow p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-600">
              {isLoading 
                ? "Loading candidates..." 
                : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, allCandidatesData.length)} out of ${allCandidatesData.length} candidates`
              }
            </div>
            <div className="flex items-center gap-4">
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:text-gray-300 disabled:hover:bg-white"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(allCandidatesData.length / itemsPerPage)))}
                  disabled={currentPage >= Math.ceil(allCandidatesData.length / itemsPerPage)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:text-gray-300 disabled:hover:bg-white"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <LoadingSpinner />
              <p className="text-gray-600 mt-4">Loading candidates...</p>
            </div>
          )}

          {/* No results message */}
          {!isLoading && allCandidatesData.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-600 text-lg">No candidates found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
            </div>
          )}

          {/* Results section */}
          {!isLoading && allCandidatesData.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Candidate cards */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {allCandidatesData
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onSelect={handleSelectCandidate}
                      selected={selectedCandidates.includes(candidate.id)}
                      jobPostId={jobPostId}
                    />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default ResumeFindPage;