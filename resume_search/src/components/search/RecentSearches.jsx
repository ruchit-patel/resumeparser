const recentSearchesRow = [
  {
    id: 1,
    title: "Python & JavaScript Developer",
    timestamp: "2 hours ago",
    data: {
      searchKeywords: [
        { text: "Python", cat: "skills", isNecessary: false },
        { text: "Javascript", cat: "skills", isNecessary: false }
      ],
      searchIn: "Entire resume",
      skills: [
        { text: "Python", cat: "skills", isNecessary: false },
        { text: "Java Script", cat: "skills", isNecessary: false }
      ],
      minExperience: "10",
      maxExperience: "20",
      currency: "INR",
      minSalary: "10",
      maxSalary: "12",
      location: "Valsad, Gujarat",
      departmentes: [
        { department: "IT Department", role: "IT Manager", fullString: "IT Department - IT Manager" },
        { department: "IT Department", role: "IT Director", fullString: "IT Department - IT Director" },
        { department: "IT Department", role: "Senior Developer", fullString: "IT Department - Senior Developer" }
      ],
      industry: "Information Technology (IT)",
      company: "Meril Life Science",
      excludeCompanies: [
        { text: "Mahindra Comviva", cat: "companies", isNecessary: false }
      ],
      designation: "Software Developer",
      noticePeriod: "1-month",
      ugcourse: [],
      uginstitute: "",
      ugeducationType: "full-time",
      ugfromYear: "",
      ugtoYear: "",
      pgcourse: [],
      pginstitute: "",
      pgeducationType: "full-time",
      pgfromYear: "",
      pgtoYear: "",
      doctorateQualification: [],
      gender: "all",
      disabilitiesOnly: false,
      category: "",
      candidateMinAge: "",
      candidateMaxAge: "",
      jobType: "",
      employmentType: "",
      workPermit: "",
      showCandidates: "all",
      verifiedFilters: []
    }
  },
  {
    id: 2,
    title: "React Frontend Developer",
    timestamp: "5 hours ago",
    data: {
      searchKeywords: [
        { text: "React", cat: "skills", isNecessary: false },
        { text: "Frontend", cat: "skills", isNecessary: false }
      ],
      searchIn: "Entire resume",
      skills: [
        { text: "React", cat: "skills", isNecessary: false },
        { text: "JavaScript", cat: "skills", isNecessary: false },
        { text: "CSS", cat: "skills", isNecessary: false }
      ],
      minExperience: "3",
      maxExperience: "8",
      currency: "INR",
      minSalary: "8",
      maxSalary: "15",
      location: "Bangalore, Karnataka",
      departmentes: [
        { department: "IT Department", role: "Frontend Developer", fullString: "IT Department - Frontend Developer" }
      ],
      industry: "Information Technology (IT)",
      company: "",
      excludeCompanies: [],
      designation: "Frontend Developer",
      noticePeriod: "1-month",
      ugcourse: [],
      uginstitute: "",
      ugeducationType: "full-time",
      ugfromYear: "",
      ugtoYear: "",
      pgcourse: [],
      pginstitute: "",
      pgeducationType: "full-time",
      pgfromYear: "",
      pgtoYear: "",
      doctorateQualification: [],
      gender: "all",
      disabilitiesOnly: false,
      category: "",
      candidateMinAge: "",
      candidateMaxAge: "",
      jobType: "",
      employmentType: "",
      workPermit: "",
      showCandidates: "all",
      verifiedFilters: []
    }
  }
];


import React, { useState ,useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Clock } from 'lucide-react';

const RecentSearches = ({
  applySearch,
  selectedSearchId,
  onClearFields,
}) => {

  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    setRecentSearches(recentSearchesRow);
  }, []);
    
  const clearSearchHistory = () => {
    setRecentSearches([]);
  };


  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h2 className="text-lg font-semibold flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          Recent Searches
        </h2>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex space-x-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onClearFields}
          >
            Clear Search Fields
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={clearSearchHistory}
          >
            Clear Search History
          </Button>
        </div>

        {recentSearches.length === 0 ? (
          <p className="text-sm text-gray-500">No recent searches found.</p>
        ) : (
          recentSearches.map((search) => {
            const isSelected = selectedSearchId === search.id;
            return (
              <div
                key={search.id}
                className={`border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => applySearch(search.data, search.id)}
              >
                <p
                  className={`text-sm font-medium ${
                    isSelected ? 'text-blue-700' : 'text-gray-800'
                  }`}
                >
                  {search.title}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <p
                    className={`text-xs ${
                      isSelected ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    Skills: {search.data.skills.map((skill) => skill.text).join(', ')}
                  </p>
                  <p
                    className={`text-xs ${
                      isSelected ? 'text-blue-500' : 'text-gray-400'
                    }`}
                  >
                    {search.timestamp}
                  </p>
                </div>
                <p
                  className={`text-xs mt-1 ${
                    isSelected ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  Experience: {search.data.minExperience} - {search.data.maxExperience} years
                </p>
                <p className="text-xs text-gray-400 mt-2">Last 1 day</p>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default RecentSearches;
