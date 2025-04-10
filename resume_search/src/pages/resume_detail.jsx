import React, { useEffect, useState } from 'react'
import ResumeProfileDetailComponent from '../components/resumeCard/ResumeProfileDetailComponent'
import CandidateCard from '../components/resumeCard/CandidateCardComponent'
import { config } from "@/config"
import { useParams } from 'react-router-dom'; 

const ResumeDetailPage = () => {
  const [candidateData, setCandidateData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  const fetchCandidateDetail = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${config.backendUrl}/api/method/resumeparser.apis.search_apis.candidate_detail/${id}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCandidateDetail().then((response) => {
        if (response?.message) {
          setCandidateData(response.message);
          console.log('Candidate data loaded:', response.message);
        }
      });
    }
  }, [id]); // Add id as dependency

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!candidateData) {
    return (
      <div className="text-center py-10 text-gray-600">
        No candidate data found
      </div>
    );
  }

  const handleSelectCandidate = (id, selected) => {
    console.log(id, selected)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
      {candidateData.id ? (
        <>
          <CandidateCard
            key={candidateData.id}
            candidate={candidateData}
            onSelect={handleSelectCandidate}
            selected={false}
          />
          <ResumeProfileDetailComponent candidate={candidateData}/>
        </>
      ) : (
        <div className="text-center py-10 text-gray-800">
          No candidate data found
        </div>
      )}
    </main>
  )
}

export default ResumeDetailPage