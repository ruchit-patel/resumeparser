import React, { useState, useEffect } from "react";
import FilterSection from "../components/resumeFilterSection/resumeFilterComponent";
import { ListFilter, ChevronDown, Loader } from "lucide-react";
import CandidateCard from "../components/resumeCard/CandidateCardComponent";
import PaginationFilter from "../components/resumeFilterSection/resumePaginationCompoent";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { config } from "@/config"
import { useLocation } from 'react-router-dom'; 

// Sample data - in a real app, this would come from an API
const fetchSearchData = async (data) => {
  try {
    console.log("Search Query Data:", data);

    // Get CSRF token from meta tag (usually present in Frappe templates)
    const csrfToken = window.csrf_token;

    console.log("CSRF Token:", csrfToken);

    const response = await fetch(`${config.backendUrl}/api/method/resumeparser.apis.search_apis.search_results`, {
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
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Relevance");
  const [showCount, setShowCount] = useState("40");
  const [allCandidatesData, setAllCandidatesData] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [displayedCandidates, setDisplayedCandidates] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState({
    keywords: "",
    location: "",
    experienceMin: "",
    experienceMax: "",
    salaryMin: "",
    salaryMax: "",
    company: "",
    designation: "",
    department: "",
    industry: "",
    newProfiles: false,
    premiumInstitute: false,
    verifiedSkills: false,
  });

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

  // Apply filters to candidates
  useEffect(() => {
    let result = [...allCandidatesData];

    // Filter by keywords (search in name, skills, etc.)
    if (filters.keywords) {
      const keywordLower = filters.keywords.toLowerCase();
      result = result.filter(
        candidate =>
          candidate.name.toLowerCase().includes(keywordLower) ||
          candidate.keySkills.some(skill => skill.toLowerCase().includes(keywordLower)) ||
          candidate.additionalSkills.some(skill => skill.toLowerCase().includes(keywordLower)) ||
          candidate.profileSummary.toLowerCase().includes(keywordLower)
      );
    }

    // Filter by location
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      result = result.filter(
        candidate =>
          candidate.location.toLowerCase().includes(locationLower) ||
          candidate.preferredLocations.some(loc => loc.toLowerCase().includes(locationLower))
      );
    }

    // Filter by experience range
    if (filters.experienceMin) {
      result = result.filter(candidate => candidate.experienceYears >= parseFloat(filters.experienceMin));
    }
    if (filters.experienceMax) {
      result = result.filter(candidate => candidate.experienceYears <= parseFloat(filters.experienceMax));
    }

    // Filter by salary range
    if (filters.salaryMin) {
      result = result.filter(candidate => candidate.salaryLacs >= parseFloat(filters.salaryMin));
    }
    if (filters.salaryMax) {
      result = result.filter(candidate => candidate.salaryLacs <= parseFloat(filters.salaryMax));
    }

    // Filter by company
    if (filters.company) {
      const companyLower = filters.company.toLowerCase();
      result = result.filter(candidate => candidate.company.toLowerCase().includes(companyLower));
    }

    // Filter by designation
    if (filters.designation) {
      const designationLower = filters.designation.toLowerCase();
      result = result.filter(candidate => 
        candidate.designation.toLowerCase().includes(designationLower) || 
        candidate.currentJob.toLowerCase().includes(designationLower)
      );
    }

    // Filter by department
    if (filters.department) {
      const departmentLower = filters.department.toLowerCase();
      result = result.filter(candidate => candidate.department.toLowerCase().includes(departmentLower));
    }

    // Filter by industry
    if (filters.industry) {
      const industryLower = filters.industry.toLowerCase();
      result = result.filter(candidate => candidate.industry.toLowerCase().includes(industryLower));
    }

    // Filter by checkbox options
    if (filters.newProfiles) {
      result = result.filter(candidate => candidate.isNewProfile);
    }
    if (filters.premiumInstitute) {
      result = result.filter(candidate => candidate.isPremiumInstitute);
    }
    if (filters.verifiedSkills) {
      result = result.filter(candidate => candidate.hasVerifiedSkills);
    }

    setFilteredCandidates(result);
  }, [allCandidatesData, filters]);

  // Apply sorting and pagination
  useEffect(() => {
    let sorted = [...filteredCandidates];

    // Apply sorting
    switch (sortBy) {
      case "Relevance":
        // Default order, could be based on match score in real app
        break;
      case "Newest":
        sorted = sorted.sort((a, b) => {
          if (a.lastModified.includes("today") && !b.lastModified.includes("today")) return -1;
          if (!a.lastModified.includes("today") && b.lastModified.includes("today")) return 1;
          if (a.lastModified.includes("week") && b.lastModified.includes("month")) return -1;
          if (a.lastModified.includes("month") && b.lastModified.includes("week")) return 1;
          return 0;
        });
        break;
      case "Price: Low to High":
        sorted = sorted.sort((a, b) => a.salaryLacs - b.salaryLacs);
        break;
      case "Price: High to Low":
        sorted = sorted.sort((a, b) => b.salaryLacs - a.salaryLacs);
        break;
      default:
        break;
    }

    // Calculate total pages
    const perPage = parseInt(showCount);
    const totalPagesCount = Math.ceil(sorted.length / perPage);
    setTotalPages(totalPagesCount || 1);

    // If current page is now invalid, reset to page 1
    if (currentPage > totalPagesCount) {
      setCurrentPage(1);
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * perPage;
    const paginatedResults = sorted.slice(startIndex, startIndex + perPage);
    
    setDisplayedCandidates(paginatedResults);
  }, [filteredCandidates, sortBy, showCount, currentPage]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    // Reset to page 1 when sort changes
    setCurrentPage(1);
  };

  const handleShowCountChange = (count) => {
    setShowCount(count);
    // Reset to page 1 when count changes
    setCurrentPage(1);
  };

  const handleSelectCandidate = (id, selected) => {
    if (selected) {
      setSelectedCandidates((prev) => [...prev, id]);
    } else {
      setSelectedCandidates((prev) => prev.filter((cid) => cid !== id));
    }
  };

  const handleExperienceChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSalaryChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
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
        {/* LEFT SIDE - FILTERS */}
        <div className="w-full lg:w-2/5 xl:w-1/4 space-y-4">
          <div className="flex items-center gap-2 bg-white shadow-sm rounded-md p-3 h-[60px]">
            <ListFilter className="w-5 h-5" />
            <h1 className="text-xl font-semibold">Filters</h1>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newProfiles"
                checked={filters.newProfiles}
                onCheckedChange={(checked) => handleFilterChange("newProfiles", checked)}
              />
              <label
                htmlFor="newProfiles"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                New Profiles
              </label>
            </div>

            <div className="border rounded-md p-4 space-y-4 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Filters</h3>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="premiumInstitute"
                    checked={filters.premiumInstitute}
                    onCheckedChange={(checked) => handleFilterChange("premiumInstitute", checked)}
                  />
                  <label htmlFor="premiumInstitute" className="text-sm font-medium leading-none">
                    Premium Institute Candidates
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verifiedSkills"
                    checked={filters.verifiedSkills}
                    onCheckedChange={(checked) => handleFilterChange("verifiedSkills", checked)}
                  />
                  <label htmlFor="verifiedSkills" className="text-sm font-medium leading-none">
                    Candidates with verified skills
                  </label>
                </div>
              </div>
            </div>

            {/* Filter sections */}
            <FilterSection
              title="Keywords"
              value={filters.keywords}
              onChange={(value) => handleFilterChange("keywords", value)}
            />

            <FilterSection
              title="Location"
              value={filters.location}
              onChange={(value) => handleFilterChange("location", value)}
            />

            <FilterSection
              title="Experience (Years)"
              value={filters.experience}
              onChange={(value) => handleFilterChange("experience", value)}
              content={
                <div className="flex items-center space-x-2 mt-2">
                  <Input 
                    type="number" 
                    placeholder="1" 
                    className="w-1/2 h-8"
                    value={filters.experienceMin}
                    onChange={(e) => handleExperienceChange("experienceMin", e.target.value)}
                  />
                  <span>to</span>
                  <Input 
                    type="number" 
                    placeholder="2" 
                    className="w-1/2 h-8"
                    value={filters.experienceMax}
                    onChange={(e) => handleExperienceChange("experienceMax", e.target.value)}
                  />
                </div>
              }
            />

            <FilterSection
              title="Salary (INR Lacs)"
              value={filters.salary}
              onChange={(value) => handleFilterChange("salary", value)}
              content={
                <div className="flex items-center space-x-2 mt-2">
                  <Input 
                    type="number" 
                    placeholder="1.50" 
                    className="w-1/2 h-8"
                    value={filters.salaryMin}
                    onChange={(e) => handleSalaryChange("salaryMin", e.target.value)}
                  />
                  <span>to</span>
                  <Input 
                    type="number" 
                    placeholder="2.50" 
                    className="w-1/2 h-8"
                    value={filters.salaryMax}
                    onChange={(e) => handleSalaryChange("salaryMax", e.target.value)}
                  />
                </div>
              }
            />

            <FilterSection
              title="Current company"
              value={filters.company}
              onChange={(value) => handleFilterChange("company", value)}
            />

            <FilterSection
              title="Current designation"
              value={filters.designation}
              onChange={(value) => handleFilterChange("designation", value)}
            />

            <FilterSection
              title="Department and Role"
              value={filters.department}
              onChange={(value) => handleFilterChange("department", value)}
            />

            <FilterSection
              title="Industry"
              value={filters.industry}
              onChange={(value) => handleFilterChange("industry", value)}
            />
          </div>
        </div>

        {/* RIGHT SIDE - RESULTS */}
        <div className="w-full lg:w-3/5 xl:w-3/4 space-y-4">
          {/* Results count and pagination */}
          <div className="bg-white rounded-md shadow p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-smedium text-gray-500">
              {isLoading 
                ? "Loading candidates..." 
                : `Showing ${displayedCandidates.length} of ${filteredCandidates.length} candidates`
              }
            </div>
            {!isLoading && (
              <PaginationFilter
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onSortChange={handleSortChange}
                onShowCountChange={handleShowCountChange}
              />
            )}
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="bg-white rounded-md shadow p-4">
              <LoadingSpinner />
            </div>
          )}

          {/* No results message */}
          {!isLoading && displayedCandidates.length === 0 && (
            <div className="bg-white rounded-md shadow p-8 text-center">
              <p className="text-gray-500">No candidates match your search criteria. Try adjusting your filters.</p>
            </div>
          )}

          {/* Candidate cards */}
          {!isLoading && (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {displayedCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onSelect={handleSelectCandidate}
                  selected={selectedCandidates.includes(candidate.id)}
                />
              ))}
            </div>
          )}

          {/* Bottom pagination for many results */}
          {!isLoading && displayedCandidates.length > 5 && (
            <div className="bg-white rounded-md shadow p-4 flex justify-center">
              <PaginationFilter
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onSortChange={handleSortChange}
                onShowCountChange={handleShowCountChange}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ResumeFindPage;