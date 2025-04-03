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
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('search');
  
  // Handle search submission
  const handleSearch = () => {
    alert("Field are searching ....")
    const JSONFormate = {
      searchKeywords:searchKeywords,
      searchIn:searchIn,
      skills:skills,
      minExperience:minExperience,
      maxExperience:maxExperience,
      currency:currency,
      minSalary:minSalary,
      maxSalary:maxSalary,
      location:location
    }
    console.log(JSONFormate)
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
                <EmploymentDetails />
                <EducationDetails />
                <DiversityDetails />
                
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
