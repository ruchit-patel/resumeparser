import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import SearchForm from '../components/search/SearchForm';
import EmploymentDetails from '../components/employment/EmploymentDetails';
import EducationDetails from '../components/education/EducationDetails';
import DiversityDetails from '../components/diversity/DiversityDetails';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import SaveResumesComponent from './SaveResumesComponent';
import RecentSearches from '../components/search/RecentSearches';
import { useFrappeCreateDoc } from 'frappe-react-sdk';

const ResumeFindPage = () => {
  const navigate = useNavigate();
  
  // Initial form state
  const initialFormState = {
    // Search Form
    searchKeywords: [],
    searchIn: 'Entire resume',
    skills: [],
    minExperience: '',
    maxExperience: '',
    minSalary: '',
    maxSalary: '',
    location: '',
    currency: 'INR',
    // Employment Details
    departmentes: [],
    industry: '',
    company: '',
    excludeCompanies: [],
    designation: '',
    noticePeriod: 'any',
    // Education Details
    ugQualification: '',
    pgQualification: '',
    doctorateQualification: [],
    ugcourse: [],
    uginstitute: '',
    ugeducationType: 'full-time',
    ugfromYear: '',
    ugtoYear: '',
    pgcourse: [],
    pginstitute: '',
    pgeducationType: 'full-time',
    pgfromYear: '',
    pgtoYear: '',
    // Diversity and Additional Details
    gender: 'all',
    disabilitiesOnly: false,
    category: '',
    candidateMinAge: '',
    candidateMaxAge: '',
    jobType: '',
    employmentType: '',
    workPermit: '',
    showCandidates: 'all',
    verifiedFilters: []
  };

  const [formState, setFormState] = useState(initialFormState);
  const [activeTab, setActiveTab] = useState('search');
  const [selectedSearchId, setSelectedSearchId] = useState(null);
  const { createDoc, isCompleted, error, loading } = useFrappeCreateDoc();
  

  // Function to update any field in the form
  const updateFormField = (field, value) => {
    setFormState(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const clearSearchFields = () => {
    setFormState(initialFormState);
    setSelectedSearchId(null);
  };
  // Function to clear the form
  const clearForm = () => {
    setFormState(initialFormState);
    setSelectedSearchId(null);
  };

  // Handle search submission
  const handleSearch = async() => {
    try {
    await createDoc("Seach History", {
      datetime: new Date().toISOString().slice(0, 19).replace("T", " "),
      save_form: JSON.stringify(formState)
    });
    navigate(`/resume_search/results`, { state: { searchData: formState } });
    } catch (error) {
      console.log("Error saving search history:", error);
    }
  };

  // Function to apply a recent search
  const applyRecentSearch = (searchData, id) => {
    setFormState(searchData);
    setSelectedSearchId(id);
  };

  return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Left column - Search forms */}
          
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0">
                <TabsTrigger 
                  value="search" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-white px-4 py-2"
                >
                  Search candidates
                </TabsTrigger>
                <TabsTrigger 
                  value="saved" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-white px-4 py-2"
                >
                  Saved Notes
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="search" className="mt-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                {/* Left column - Search forms */}
              <div className="md:w-4/5 space-y-6">
                {/*  Search Form */}
                <SearchForm 
                  formState={formState}
                  updateFormField={updateFormField}
                />

                {/* Employment Details */}
                <EmploymentDetails 
                  formState={formState}
                  updateFormField={updateFormField}
                />

                {/* Education Details */}
                <EducationDetails 
                  formState={formState}
                  updateFormField={updateFormField}
                />

                {/* Diversity and Additional Details */}
                <DiversityDetails 
                  formState={formState}
                  updateFormField={updateFormField}
                />
                
                <div className="flex justify-end items-center mt-4 mb-8">
                  <Button onClick={handleSearch} className="text-white bg-blue-800">
                    <span>Search candidates</span>
                  </Button>

                </div>

              </div>

               {/* Right column - Recent searches */}
              <div className="md:w-1/5">
                  <RecentSearches 
                    applySearch={applyRecentSearch}
                    selectedSearchId={selectedSearchId}
                    onClearFields={clearSearchFields}
                  />     
              </div>


              </TabsContent>
              
              <TabsContent value="saved">
                <SaveResumesComponent />
              </TabsContent>
            </Tabs>

      </main>
  );
}

export default ResumeFindPage;
