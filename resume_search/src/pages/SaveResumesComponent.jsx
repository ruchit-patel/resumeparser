import React, { useState, useEffect } from 'react';
import CandidateCard from '../components/resumeCard/CandidateCardComponent';

const SaveResumesComponent = () => {
  // State management
  const [allCandidatesData, setAllCandidatesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Fetch saved resumes data once on component load
  useEffect(() => {
    const fetchSavedResumes = async () => {
      setIsLoading(true);
      try {
        // Get all saved resumes for the current user
        const response = await fetch(`/api/method/resumeparser.apis.update_profile.saved_resumes`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setAllCandidatesData(result.message);
      } catch (error) {
        console.error('Error fetching saved resumes:', error);
        setAllCandidatesData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedResumes();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <LoadingSpinner />
      ) : allCandidatesData.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Candidate cards */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {allCandidatesData.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onSelect={() => {}}
                selected={false}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-600">You haven't saved any resumes yet.</p>
        </div>
      )}
    </div>
  );
};

export default SaveResumesComponent