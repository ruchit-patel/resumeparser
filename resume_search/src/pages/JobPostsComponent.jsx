import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, Briefcase, Users, Search, Filter, X } from "lucide-react";

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

const JobPostsComponent = () => {
  // State management
  const [jobPosts, setJobPosts] = useState([]);
  const [filteredJobPosts, setFilteredJobPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch job posts data with filtering
  const fetchJobPosts = async (filterParams = {}) => {
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
          filters: filterParams
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const jobPostsData = result.message || [];
      setJobPosts(jobPostsData);
      setFilteredJobPosts(jobPostsData);
    } catch (error) {
      console.error('Error fetching job posts:', error);
      setJobPosts([]);
      setFilteredJobPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchJobPosts();
  }, []);

  // Filter job posts based on search criteria
  useEffect(() => {
    let filtered = jobPosts;

    if (filters.title.trim()) {
      filtered = filtered.filter(job =>
        job.job_title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.client.trim()) {
      filtered = filtered.filter(job =>
        job.client.toLowerCase().includes(filters.client.toLowerCase())
      );
    }

    setFilteredJobPosts(filtered);
  }, [filters, jobPosts]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      title: "",
      client: ""
    });
  };

  const handleSearchCandidates = (jobPost) => {
    alert('Search functionality is in progress...');
    console.log('Searching candidates for job post:', jobPost);
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
      ) : filteredJobPosts.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Results Header */}
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredJobPosts.length} of {jobPosts.length} job posts
            </div>
          </div>
          
          {/* Job Post cards */}
          <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2">
            {filteredJobPosts.map((jobPost) => (
              <JobPostCard
                key={jobPost.name}
                jobPost={jobPost}
                onSearchCandidates={handleSearchCandidates}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {jobPosts.length === 0 ? (
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