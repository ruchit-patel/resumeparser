import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, Briefcase, Users, Search, Filter, X } from "lucide-react";
import CustomPagination from "../components/ui/custom-pagination";

const JobPostCard = ({ jobPost, onSearchCandidates }) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {jobPost.job_title}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              {jobPost.client && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {jobPost.client}
                </Badge>
              )}
              {jobPost.employment_type && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {jobPost.employment_type}
                </Badge>
              )}
              {jobPost.industry && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {jobPost.industry}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Role and Department */}
          {(jobPost.role || jobPost.designation || jobPost.department) && (
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              {jobPost.role && (
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  Role: {jobPost.role}
                </span>
              )}
              {jobPost.designation && (
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
                  Designation: {jobPost.designation}
                </span>
              )}
              {jobPost.department && (
                <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">
                  Department: {jobPost.department}
                </span>
              )}
            </div>
          )}

          {/* Job Description */}
          <div>
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
              {jobPost.job_description}
            </p>
          </div>

          {/* Key Skills */}
          {jobPost.key_skill && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Key Skills:</p>
              <div className="flex flex-wrap gap-1">
                {(() => {
                  try {
                    const skills = JSON.parse(jobPost.key_skill);
                    return Array.isArray(skills) ? skills.map((skill, index) => (
                      <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    )) : (
                      <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {jobPost.key_skill}
                      </span>
                    );
                  } catch (e) {
                    // If JSON parsing fails, treat as comma-separated string
                    const skills = jobPost.key_skill.split(',').map(s => s.trim()).filter(s => s);
                    return skills.map((skill, index) => (
                      <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ));
                  }
                })()}
              </div>
            </div>
          )}

          {/* Search Candidates Button */}
          <div className="pt-3 border-t">
            <Button 
              onClick={() => onSearchCandidates(jobPost)}
              className="w-full flex items-center justify-center gap-2"
              variant="default"
            >
              <Search className="w-4 h-4" />
              Search Candidates with this Job Post
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const JobPostsComponent = ({ onSearchCandidatesWithJobPost }) => {
  // State management
  const [jobPosts, setJobPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    title: "",
    client: ""
  });
  
  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Fetch job posts data with filtering and pagination
  const fetchJobPosts = async (page = 1, filterParams = {}) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/method/resumeparser.apis.custom_apis.get_filtered_job_posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': window.csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          filters: filterParams,
          page: page,
          per_page: 10
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const data = result.message || {};
      setJobPosts(data.data || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Error fetching job posts:', error);
      setJobPosts([]);
      setPagination({});
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and fetch on page/filter changes
  useEffect(() => {
    fetchJobPosts(currentPage, {
      title: filters.title || undefined,
      client: filters.client || undefined
    });
  }, [currentPage, filters]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      title: "",
      client: ""
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchCandidates = (jobPost) => {
    // Parse skills from key_skill
    let skillsArray = [];
    if (jobPost.key_skill) {
      try {
        // Try to parse as JSON first
        const parsedSkills = JSON.parse(jobPost.key_skill);
        skillsArray = Array.isArray(parsedSkills) 
          ? parsedSkills.map(skill => ({ text: skill, isNassary: false }))
          : [{ text: jobPost.key_skill, isNassary: false }];
      } catch (e) {
        // If JSON parsing fails, treat as comma-separated string
        skillsArray = jobPost.key_skill
          .split(',')
          .map(s => s.trim())
          .filter(s => s)
          .map(skill => ({ text: skill, isNassary: false }));
      }
    }

    // Create search keywords from role, designation, department
    let searchKeywordsArray = [];
    if (jobPost.role) {
      searchKeywordsArray.push({ text: jobPost.role, isNassary: false });
    }
    if (jobPost.designation) {
      searchKeywordsArray.push({ text: jobPost.designation, isNassary: false });
    }
    if (jobPost.department) {
      searchKeywordsArray.push({ text: jobPost.department, isNassary: false });
    }

    // Create the form state object with job post ID
    const populatedFormState = {
      searchKeywords: searchKeywordsArray,
      skills: skillsArray,
      searchIn: 'Entire resume',
      minExperience: '',
      maxExperience: '',
      minSalary: '',
      maxSalary: '',
      salaryNotProvided: false,
      location: '',
      currency: 'INR',
      departmentes: [],
      industry: jobPost.industry || '',
      company: '',
      excludeCompanies: [],
      designation: '',
      noticePeriod: 'any',
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
      gender: 'all',
      disabilitiesOnly: false,
      category: '',
      candidateMinAge: '',
      candidateMaxAge: '',
      currentJobType: '',
      seekingJobType: '',
      // Add job post ID to the form state
      jobPostId: jobPost.name,
    };

    // Pass the populated form state to parent component
    if (typeof onSearchCandidatesWithJobPost === 'function') {
      onSearchCandidatesWithJobPost(populatedFormState);
    } else {
      console.log('Populated form state for job post search:', populatedFormState);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="title-filter">Job Title</Label>
            <Input
              id="title-filter"
              placeholder="Search by job title..."
              value={filters.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="client-filter">Client</Label>
            <Input
              id="client-filter"
              placeholder="Search by client name..."
              value={filters.client}
              onChange={(e) => handleFilterChange('client', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={clearFilters} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={!filters.title && !filters.client}
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(filters.title || filters.client) && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.title && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Title: {filters.title}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('title', '')}
                  />
                </Badge>
              )}
              {filters.client && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Client: {filters.client}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('client', '')}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {isLoading ? (
        <LoadingSpinner />
      ) : jobPosts.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Results Header */}
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {jobPosts.length} job posts (Page {pagination.current_page || 1} of {pagination.total_pages || 1})
            </div>
          </div>
          
          {/* Job Post cards */}
          <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2">
            {jobPosts.map((jobPost) => (
              <JobPostCard
                key={jobPost.name}
                jobPost={jobPost}
                onSearchCandidates={handleSearchCandidates}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="mt-6 pt-6 border-t">
              <CustomPagination
                currentPage={pagination.current_page || 1}
                totalPages={pagination.total_pages || 1}
                onPageChange={handlePageChange}
                hasNext={pagination.has_next}
                hasPrev={pagination.has_prev}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {pagination.total_count === 0 ? (
              <>
                <p className="text-gray-600 text-lg mb-2">No job posts found</p>
                <p className="text-gray-500 text-sm">Create your first job post to get started</p>
              </>
            ) : (
              <>
                <p className="text-gray-600 text-lg mb-2">No job posts match your filters</p>
                <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
                <Button onClick={clearFilters} variant="outline" className="mt-4">
                  Clear All Filters
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostsComponent;