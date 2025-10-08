import React, { useState, useEffect } from 'react';
import CandidateCard from '../components/resumeCard/CandidateCardComponent';
import CustomPagination from '../components/ui/custom-pagination';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const SharedResumesComponent = () => {
  // State management
  const [allCandidatesData, setAllCandidatesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total_count: 0,
    total_pages: 0,
    per_page: 10,
    has_next: false,
    has_prev: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sharedByUsers, setSharedByUsers] = useState([]);
  const [selectedSharedBy, setSelectedSharedBy] = useState('');

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Fetch shared resumes data
  const fetchSharedResumes = async (page = 1, search = '', sharedByFilter = '') => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '10',
      });

      if (search) {
        params.append('search_term', search);
      }

      if (sharedByFilter) {
        params.append('shared_by_filter', sharedByFilter);
      }

      const response = await fetch(`/api/method/resumeparser.apis.custom_apis.shared_resumes?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setAllCandidatesData(result.message.data || []);
      setPagination(result.message.pagination || {
        total_count: 0,
        total_pages: 0,
        per_page: 10,
        has_next: false,
        has_prev: false
      });
      setSharedByUsers(result.message.shared_by_users || []);
    } catch (error) {
      console.error('Error fetching shared resumes:', error);
      setAllCandidatesData([]);
      setPagination({
        total_count: 0,
        total_pages: 0,
        per_page: 10,
        has_next: false,
        has_prev: false
      });
      setSharedByUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on component mount and when page, search, or filter changes
  useEffect(() => {
    fetchSharedResumes(currentPage, searchTerm, selectedSharedBy);
  }, [currentPage, searchTerm, selectedSharedBy]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Handle shared by filter change
  const handleSharedByChange = (e) => {
    setSelectedSharedBy(e.target.value);
    setCurrentPage(1);
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setSelectedSharedBy('');
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2 items-center">
          {/* Search Input - Half Width */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by candidate name, email, or city..."
              value={searchInput}
              onChange={handleSearchInputChange}
              className="w-full"
            />
          </div>

          {/* Shared By Filter - Half Width */}
          <div className="flex-1">
            <select
              value={selectedSharedBy}
              onChange={handleSharedByChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Filter by Shared By - All Users</option>
              {sharedByUsers.map((user) => (
                <option key={user.email} value={user.email}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
            Search
          </Button>

          {(searchTerm || selectedSharedBy) && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClearAllFilters}
              className="whitespace-nowrap"
            >
              Clear All
            </Button>
          )}
        </form>

        {/* Search Info */}
        {(searchTerm || selectedSharedBy) && (
          <div className="mt-3 text-sm text-gray-600 border-t pt-3">
            {searchTerm && (
              <div>
                Searching for: <span className="font-semibold">{searchTerm}</span>
              </div>
            )}
            {selectedSharedBy && (
              <div>
                Filtered by: <span className="font-semibold">
                  {sharedByUsers.find(u => u.email === selectedSharedBy)?.name || selectedSharedBy}
                </span>
              </div>
            )}
            <div className="mt-1">
              Found <span className="font-semibold">{pagination.total_count}</span> result(s)
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : allCandidatesData.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Results Summary */}
            <div className="mb-4 pb-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Shared Resumes ({pagination.total_count})
              </h2>
              <p className="text-sm text-gray-600">
                Page {currentPage} of {pagination.total_pages}
              </p>
            </div>

            {/* Candidate cards */}
            <div className="space-y-4">
              {allCandidatesData.map((candidate) => (
                <div key={candidate.id} className="relative">
                  <CandidateCard
                    candidate={candidate}
                    onSelect={() => {}}
                    selected={false}
                  />
                  {/* Shared By Info Badge */}
                  <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    Shared by: {candidate.shared_by}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="mt-6 flex justify-center">
              <CustomPagination
                currentPage={currentPage}
                totalPages={pagination.total_pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-600">
            {searchTerm
              ? `No resumes found matching "${searchTerm}"`
              : 'No resumes have been shared with you yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SharedResumesComponent;
