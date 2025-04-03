import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './components/ui/select';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SearchForm from './components/search/SearchForm';
import RecentSearches from './components/search/RecentSearches';
import EmploymentDetails from './components/employment/EmploymentDetails';
import EducationDetails from './components/education/EducationDetails';
import DiversityDetails from './components/diversity/DiversityDetails';
import { FrappeProvider } from 'frappe-react-sdk'
import './App.css';

function App() {
  // Search Form
  const [searchKeywords, setSearchKeywords] = useState([]);
  const [searchIn, setSearchIn] = useState('Entire resume');
  const [skills, setSkills] = useState([]);
  const [minExperience, setMinExperience] = useState('');
  const [maxExperience, setMaxExperience] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [location, setLocation] = useState("");
  const [currency, setCurrency] = useState('INR');
  

  // Employement Details
  const [departmentes, setDepartmentes] = useState([]);
  const [industry, setIndustry] = useState("");
  const [company, setCompany] = useState("");
  const [excludeCompanies, setExcludeCompanies] = useState([]);
  const [designation, setDesignation] = useState("");
  const [noticePeriod, setNoticePeriod] = useState('any');

  // education Details

    const [ugQualification, setUgQualification] = useState('any');
    const [course, setCourse] = useState([]);
    const [institute, setInstitute] = useState('');
    const [educationType, setEducationType] = useState('full-time');
    const [fromYear, setFromYear] = useState('');
    const [toYear, setToYear] = useState('');
    const [pgQualification, setPgQualification] = useState('any');
    const [doctorateQualification, setdoctorateQualification] = useState([]);

    //  Diversity and Additional Details 
    const [gender, setGender] = useState('all');
    const [disabilitiesOnly, setDisabilitiesOnly] = useState(false);
    const [category , setCategory] = useState("");
    const [candidateMinAge , setCandidateMinAge] = useState("");
    const [candidateMaxAge , setCandidateMaxAge] = useState("");
    const [jobType, setJobType] = useState('');
    const [employmentType, setEmploymentType] = useState('');
    const [workPermit, setWorkPermit] = useState('');
    const [showCandidates, setShowCandidates] = useState('all');
    const [verifiedFilters, setVerifiedFilters] = useState([]);


  // State for active tab
  const [activeTab, setActiveTab] = useState('search');
  
  // Handle search submission
  const handleSearch = () => {
    alert("Field are searching ....")
    const JSONFormate = {
      // Search
      searchKeywords:searchKeywords,
      searchIn:searchIn,
      skills:skills,
      minExperience:minExperience,
      maxExperience:maxExperience,
      currency:currency,
      minSalary:minSalary,
      maxSalary:maxSalary,
      location:location,

      //  Employment
      departmentes:departmentes,
      industry:industry,
      company:company,
      excludeCompanies:excludeCompanies,
      designation:designation,
      noticePeriod:noticePeriod,


      // Education Details
      course:course,
      institute:institute,
      educationType:educationType,
      fromYear:fromYear,
      toYear:toYear,
      doctorateQualification:doctorateQualification,

      //  Diversity and Additional Details 
      gender:gender,
      disabilitiesOnly:disabilitiesOnly, 
      category:category , 
      candidateMinAge:candidateMinAge , 
      candidateMaxAge:candidateMaxAge ,
      jobType:jobType,
      employmentType:employmentType,
      workPermit:workPermit, 
      showCandidates:showCandidates,
      verifiedFilters:verifiedFilters,
    }
    
    console.log(JSONFormate)
    // alert(JSON.stringify(JSONFormate))
    // In a real application, this would trigger an API call
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FrappeProvider>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          
          {/* Left column - Search forms */}
          <div className="md:w-3/3 space-y-6">
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
              
              <TabsContent value="search" className="mt-6 space-y-6">


                {/*  Search Form */}
                <SearchForm 
                  searchKeywords={searchKeywords}
                  setSearchKeywords={setSearchKeywords}
                  searchIn={searchIn}
                  setSearchIn={setSearchIn}
                  skills={skills}
                  setSkills={setSkills}
                  minExperience={minExperience}
                  setMinExperience={setMinExperience}
                  maxExperience={maxExperience}
                  minSalary={minSalary}
                  setMinSalary={setMinSalary}
                  maxSalary={maxSalary}
                  setMaxSalary={setMaxSalary}
                  setMaxExperience={setMaxExperience}
                  location={location}
                  setLocation={setLocation}
                  currency={currency}
                  setCurrency={setCurrency}
                />

                {/* Employment Details */}
                <EmploymentDetails
                  departmentes={departmentes}
                  setDepartmentes={setDepartmentes}
                  industry={industry}
                  setIndustry={setIndustry}
                  company={company}
                  setCompany={setCompany}
                  excludeCompanies={excludeCompanies}
                  setExcludeCompanies={setExcludeCompanies}
                  designation={designation}
                  setDesignation={setDesignation}
                  noticePeriod={noticePeriod}
                  setNoticePeriod={setNoticePeriod}
                />


                {/* Education Dwatils */}
                <EducationDetails 
                  ugQualification={ugQualification}
                  setUgQualification={setUgQualification}
                  course={course}
                  setCourse={setCourse}
                  institute={institute}
                  setInstitute={setInstitute}
                  educationType={educationType}
                  setEducationType={setEducationType}
                  fromYear={fromYear}
                  setFromYear={setFromYear}
                  toYear={toYear}
                  setToYear={setToYear}
                  pgQualification={pgQualification}
                  setPgQualification={setPgQualification}
                  doctorateQualification={doctorateQualification}
                  setdoctorateQualification={setdoctorateQualification}
                />

                {/* Diversity and Additional Details */}
                <DiversityDetails
                gender={gender}
                setGender={setGender}
                disabilitiesOnly={disabilitiesOnly}
                setDisabilitiesOnly={setDisabilitiesOnly}
                category={category}
                setCategory={setCategory}
                candidateMinAge={candidateMinAge}
                setCandidateMinAge={setCandidateMinAge}
                candidateMaxAge={candidateMaxAge}
                setCandidateMaxAge={setCandidateMaxAge}
                jobType={jobType}
                setJobType={setJobType}
                employmentType={employmentType}
                setEmploymentType={setEmploymentType}
                workPermit={workPermit}
                setWorkPermit={setWorkPermit}
                showCandidates={showCandidates}
                setShowCandidates={setShowCandidates}
                verifiedFilters={verifiedFilters}
                setVerifiedFilters={setVerifiedFilters}        
                />
                
                <div className="flex justify-end items-center mt-4 mb-8">
                  <Button onClick={handleSearch} className="text-white bg-blue-800">
                    <span>Search candidates</span>
                  </Button>

                </div>
              </TabsContent>
              
              <TabsContent value="saved">
                <Card className="mt-6">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Saved Notes</h2>
                    <p className="text-gray-600">You don't have any saved notes yet.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column - Recent searches */}
          {/* <div className="md:w-1/3">
            <RecentSearches />
          </div> */}


        </div>
      </main>
      
      <Footer />
      </FrappeProvider>
    </div>
  );
}

export default App;
