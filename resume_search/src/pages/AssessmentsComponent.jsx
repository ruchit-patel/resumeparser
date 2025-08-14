import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CustomPagination from "@/components/ui/custom-pagination";
import { Building2, User, Calendar, Eye, Search, Filter, X, FileText, Download, Settings } from "lucide-react";

const FieldSelectionDialog = ({ open, onClose, onConfirm, assessment }) => {
  const [selectedFields, setSelectedFields] = useState({});

  // Field mapping with short codes for URL optimization
  const fieldGroups = {
    "Basic Information": {
      "1": { name: "candidate_name", label: "Candidate Name" },
      "2": { name: "job_post", label: "Job Post" },
      "3": { name: "earlier_interviewed_with_the_client", label: "Earlier Interviewed" },
      "4": { name: "time_line_of_earlier_interview", label: "Interview Timeline" },
      "5": { name: "updated_by", label: "Updated By" }
    },
    "Personal & Professional": {
      "6": { name: "current_organization", label: "Current Organization" },
      "7": { name: "gender", label: "Gender" },
      "8": { name: "diversity_flag", label: "Diversity Flag" },
      "9": { name: "total_experience", label: "Total Experience" },
      "10": { name: "location", label: "Location" },
      "11": { name: "willingness_to_relocate", label: "Willing to Relocate" },
      "12": { name: "education_highest", label: "Education Highest" },
      "13": { name: "any_disabilities", label: "Any Disabilities" }
    },
    "Work Experience & Management": {
      "14": { name: "reporting_to", label: "Reporting To" },
      "15": { name: "team_size_managed", label: "Team Size Managed" },
      "16": { name: "structure_of_the_team", label: "Team Structure" },
      "17": { name: "budget_managed", label: "Budget Managed" },
      "18": { name: "revenue_or_manpower_or_budget_managed_as_is_the_case_in_role", label: "Revenue/Manpower Managed" },
      "19": { name: "numbers_to_be_provided", label: "Numbers to Provide" },
      "20": { name: "relevant_experience", label: "Relevant Experience" }
    },
    "Compensation & Notice": {
      "21": { name: "current_compensation", label: "Current Compensation" },
      "22": { name: "expected_compensation", label: "Expected Compensation" },
      "23": { name: "notice_period", label: "Notice Period" }
    },
    "Assessment & Comments": {
      "24": { name: "stability_comments", label: "Stability Comments" },
      "25": { name: "reason_for_change", label: "Reason for Change" },
      "26": { name: "fitment_to_the_role", label: "Fitment to Role" },
      "27": { name: "must_haves_as_defined_by_client", label: "Must Haves (Client)" },
      "28": { name: "executive_presence_and_ability_to_think_and_act_strategically", label: "Executive Presence" },
      "29": { name: "call_outs", label: "Call Outs" },
      "30": { name: "gap_in_education_if_any_reason", label: "Education Gap Reason" },
      "31": { name: "gap_in_jobs_if_any", label: "Job Gap Reason" },
      "32": { name: "confirmation", label: "Confirmation" },
      "33": { name: "awards_recognitions_and_certifications", label: "Awards & Certifications" }
    }
  };

  // Initialize all fields as selected when dialog opens
  useEffect(() => {
    if (open) {
      const allFields = {};
      Object.values(fieldGroups).forEach(group => {
        Object.keys(group).forEach(code => {
          allFields[code] = true;
        });
      });
      setSelectedFields(allFields);
    }
  }, [open]);

  const handleFieldToggle = (code) => {
    setSelectedFields(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  const handleSelectAll = (groupFields) => {
    const newState = { ...selectedFields };
    Object.keys(groupFields).forEach(code => {
      newState[code] = true;
    });
    setSelectedFields(newState);
  };

  const handleDeselectAll = (groupFields) => {
    const newState = { ...selectedFields };
    Object.keys(groupFields).forEach(code => {
      newState[code] = false;
    });
    setSelectedFields(newState);
  };

  const handleConfirm = () => {
    const selectedCodes = Object.keys(selectedFields).filter(code => selectedFields[code]);
    onConfirm(selectedCodes);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-10xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Select Fields for PDF Export - {assessment?.candidate_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {Object.entries(fieldGroups).map(([groupName, groupFields]) => (
            <div key={groupName} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg">{groupName}</h3>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAll(groupFields)}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeselectAll(groupFields)}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(groupFields).map(([code, field]) => (
                  <div key={code} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={code}
                      checked={selectedFields[code] || false}
                      onChange={() => handleFieldToggle(code)}
                      className="rounded"
                    />
                    <label htmlFor={code} className="text-sm cursor-pointer">
                      {field.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Generate PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AssessmentCard = ({ assessment, onViewDetails }) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {assessment.candidate_name}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              {assessment.job_post && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {assessment.job_post}
                </Badge>
              )}
              {assessment.earlier_interviewed_with_the_client && (
                <Badge variant="outline" className="flex items-center gap-1 bg-orange-50 text-orange-700">
                  Previously Interviewed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            {assessment.updated_by && (
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                <User className="w-3 h-3" />
                Updated by: {assessment.updated_by}
              </span>
            )}
            {assessment.creation && (
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(assessment.creation).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="pt-3 border-t">
            <Button 
              onClick={() => onViewDetails(assessment)}
              className="w-full flex items-center justify-center gap-2"
              variant="default"
            >
              <Eye className="w-4 h-4" />
              View Assessment Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AssessmentDetailsDialog = ({ assessment, open, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [fieldSelectionOpen, setFieldSelectionOpen] = useState(false);

  if (!assessment) return null;

  const displayValue = (value) => {
    if (value === null || value === "" || value === 0) {
      return "-";
    }
    return value;
  };

  const handleDownloadPDFClick = () => {
    setFieldSelectionOpen(true);
  };

  const handleDownloadPDF = async (selectedFieldCodes) => {
    setIsDownloading(true);
    try {
      // Create query string with selected field codes
      const fieldsParam = selectedFieldCodes.join(',');
      const response = await fetch(`/api/method/resumeparser.apis.custom_apis.generate_assessment_pdf?assessment_name=${assessment.name}&fields=${fieldsParam}`, {
        method: 'GET',
        headers: {
          'X-Frappe-CSRF-Token': window.csrf_token,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Assessment_${assessment.candidate_name}_${assessment.name}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-10xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Assessment Details - {assessment.candidate_name}
            </DialogTitle>
            <Button 
              onClick={handleDownloadPDFClick}
              disabled={isDownloading}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Basic Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-blue-800">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Candidate Name</Label>
                <p className="text-gray-700">{displayValue(assessment.candidate_name)}</p>
              </div>
              <div>
                <Label className="font-semibold">Job Post</Label>
                <p className="text-gray-700">{displayValue(assessment.job_post)}</p>
              </div>
              <div>
                <Label className="font-semibold">Earlier Interviewed</Label>
                <p className="text-gray-700">
                  {assessment.earlier_interviewed_with_the_client ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <Label className="font-semibold">Interview Timeline</Label>
                <p className="text-gray-700">{displayValue(assessment.time_line_of_earlier_interview)}</p>
              </div>
              <div>
                <Label className="font-semibold">Updated By</Label>
                <p className="text-gray-700">{displayValue(assessment.updated_by)}</p>
              </div>
            </div>
          </div>

          {/* Personal & Professional Details */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-green-800">Personal & Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Current Organization</Label>
                <p className="text-gray-700">{displayValue(assessment.current_organization)}</p>
              </div>
              <div>
                <Label className="font-semibold">Gender</Label>
                <p className="text-gray-700">{displayValue(assessment.gender)}</p>
              </div>
              <div>
                <Label className="font-semibold">Diversity Flag</Label>
                <p className="text-gray-700">{displayValue(assessment.diversity_flag)}</p>
              </div>
              <div>
                <Label className="font-semibold">Total Experience</Label>
                <p className="text-gray-700">{displayValue(assessment.total_experience)} years</p>
              </div>
              <div>
                <Label className="font-semibold">Location</Label>
                <p className="text-gray-700">{displayValue(assessment.location)}</p>
              </div>
              <div>
                <Label className="font-semibold">Willing to Relocate</Label>
                <p className="text-gray-700">{assessment.willingness_to_relocate ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <Label className="font-semibold">Education Highest</Label>
                <p className="text-gray-700">{displayValue(assessment.education_highest)}</p>
              </div>
              <div>
                <Label className="font-semibold">Any Disabilities</Label>
                <p className="text-gray-700">{assessment.any_disabilities ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Work Experience & Management */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-purple-800">Work Experience & Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Reporting To</Label>
                <p className="text-gray-700">{displayValue(assessment.reporting_to)}</p>
              </div>
              <div>
                <Label className="font-semibold">Team Size Managed</Label>
                <p className="text-gray-700">{displayValue(assessment.team_size_managed)}</p>
              </div>
              <div>
                <Label className="font-semibold">Budget Managed</Label>
                <p className="text-gray-700">{displayValue(assessment.budget_managed)}</p>
              </div>
              <div>
                <Label className="font-semibold">Numbers to Provide</Label>
                <p className="text-gray-700">{displayValue(assessment.numbers_to_be_provided)}</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Label className="font-semibold">Team Structure</Label>
              <p className="text-gray-700 bg-white p-3 rounded">
                {displayValue(assessment.structure_of_the_team)}
              </p>
            </div>
            
            <div className="mt-4 space-y-2">
              <Label className="font-semibold">Revenue/Manpower/Budget Managed</Label>
              <p className="text-gray-700 bg-white p-3 rounded">
                {displayValue(assessment.revenue_or_manpower_or_budget_managed_as_is_the_case_in_role)}
              </p>
            </div>
          </div>

          {/* Relevant Experience */}
          {assessment.relevant_experience && assessment.relevant_experience.length > 0 && (
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-3 text-orange-800">Relevant Experience</h3>
              <div className="space-y-2">
                {assessment.relevant_experience.map((exp, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{displayValue(exp.title)}</p>
                        <p className="text-sm text-gray-600">{displayValue(exp.experience)} years</p>
                      </div>
                    </div>
                    {exp.note && (
                      <p className="text-sm text-gray-700 mt-2">{exp.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compensation & Notice Period */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-yellow-800">Compensation & Notice Period</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Current Compensation</Label>
                <p className="text-gray-700">{displayValue(assessment.current_compensation)}</p>
              </div>
              <div>
                <Label className="font-semibold">Expected Compensation</Label>
                <p className="text-gray-700">{displayValue(assessment.expected_compensation)}</p>
              </div>
              <div>
                <Label className="font-semibold">Notice Period</Label>
                <p className="text-gray-700">{displayValue(assessment.notice_period)}</p>
              </div>
            </div>
          </div>

          {/* Awards & Certifications */}
          {assessment.awards_recognitions_and_certifications && assessment.awards_recognitions_and_certifications.length > 0 && (
            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-3 text-pink-800">Awards & Certifications</h3>
              <div className="space-y-2">
                {assessment.awards_recognitions_and_certifications.map((award, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <p className="font-semibold">{displayValue(award.title || award.name)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessment & Comments */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-gray-800">Assessment & Comments</h3>
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Stability Comments</Label>
                <p className="text-gray-700 bg-white p-3 rounded mt-1">
                  {displayValue(assessment.stability_comments)}
                </p>
              </div>
              
              <div>
                <Label className="font-semibold">Reason for Change</Label>
                <p className="text-gray-700 bg-white p-3 rounded mt-1">
                  {displayValue(assessment.reason_for_change)}
                </p>
              </div>
              
              <div>
                <Label className="font-semibold">Fitment to Role</Label>
                <p className="text-gray-700 bg-white p-3 rounded mt-1">
                  {displayValue(assessment.fitment_to_the_role)}
                </p>
              </div>
              
              <div>
                <Label className="font-semibold">Must Haves (Client Defined)</Label>
                <p className="text-gray-700 bg-white p-3 rounded mt-1">
                  {displayValue(assessment.must_haves_as_defined_by_client)}
                </p>
              </div>
              
              <div>
                <Label className="font-semibold">Executive Presence & Strategic Thinking</Label>
                <p className="text-gray-700 bg-white p-3 rounded mt-1">
                  {displayValue(assessment.executive_presence_and_ability_to_think_and_act_strategically)}
                </p>
              </div>
              
              <div>
                <Label className="font-semibold">Call Outs</Label>
                <p className="text-gray-700 bg-white p-3 rounded mt-1">
                  {displayValue(assessment.call_outs)}
                </p>
              </div>
              
              <div>
                <Label className="font-semibold">Education Gap Reason</Label>
                <p className="text-gray-700 bg-white p-3 rounded mt-1">
                  {displayValue(assessment.gap_in_education_if_any_reason)}
                </p>
              </div>
              
              <div>
                <Label className="font-semibold">Job Gap Reason</Label>
                <p className="text-gray-700 bg-white p-3 rounded mt-1">
                  {displayValue(assessment.gap_in_jobs_if_any)}
                </p>
              </div>
              
              <div>
                <Label className="font-semibold">Confirmation</Label>
                <p className="text-gray-700">{assessment.confirmation ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
          
          {/* Footer Info */}
          <div className="flex justify-between items-center text-sm text-gray-500 mt-6 pt-4 border-t bg-gray-50 p-3 rounded">
            <span>Created: {new Date(assessment.creation).toLocaleString()}</span>
            <span>Modified: {new Date(assessment.modified).toLocaleString()}</span>
            <span>ID: {assessment.name}</span>
          </div>
        </div>

        {/* Field Selection Dialog */}
        <FieldSelectionDialog 
          open={fieldSelectionOpen}
          onClose={() => setFieldSelectionOpen(false)}
          onConfirm={handleDownloadPDF}
          assessment={assessment}
        />
      </DialogContent>
    </Dialog>
  );
};

const AssessmentsComponent = () => {
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    jobPost: "",
    candidateName: "",
    updatedBy: ""
  });
  
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const fetchAssessments = async (page = 1, searchFilters = {}) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '10',
        ...searchFilters
      });

      const response = await fetch(`/api/method/resumeparser.apis.custom_apis.get_assessments?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': window.csrf_token,
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const data = result.message || {};
      
      setAssessments(data.data || []);
      setPagination(data.pagination || {});
    } catch (error) {
      console.error('Error fetching assessments:', error);
      setAssessments([]);
      setPagination({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments(currentPage, {
      job_post_filter: filters.jobPost || "",
      candidate_name_filter: filters.candidateName || "",
      updated_by_filter: filters.updatedBy || ""
    });
  }, [currentPage, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setFilters({
      jobPost: "",
      candidateName: "",
      updatedBy: ""
    });
    setCurrentPage(1);
  };

  const handleViewDetails = async (assessment) => {
    try {
      const response = await fetch(`/api/method/resumeparser.apis.custom_apis.get_assessment_details?assessment_name=${assessment.name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': window.csrf_token,
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.message?.status === 'success') {
        setSelectedAssessment(result.message.data);
        setDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching assessment details:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="jobpost-filter">Job Post</Label>
            <Input
              id="jobpost-filter"
              placeholder="Search by job post..."
              value={filters.jobPost}
              onChange={(e) => handleFilterChange('jobPost', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="candidate-filter">Candidate Name</Label>
            <Input
              id="candidate-filter"
              placeholder="Search by candidate name..."
              value={filters.candidateName}
              onChange={(e) => handleFilterChange('candidateName', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="updated-by-filter">Updated By</Label>
            <Input
              id="updated-by-filter"
              placeholder="Search by updated by..."
              value={filters.updatedBy}
              onChange={(e) => handleFilterChange('updatedBy', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={clearFilters} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={!filters.jobPost && !filters.candidateName && !filters.updatedBy}
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(filters.jobPost || filters.candidateName || filters.updatedBy) && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.jobPost && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Job Post: {filters.jobPost}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('jobPost', '')}
                  />
                </Badge>
              )}
              {filters.candidateName && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Candidate: {filters.candidateName}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('candidateName', '')}
                  />
                </Badge>
              )}
              {filters.updatedBy && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Updated By: {filters.updatedBy}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('updatedBy', '')}
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
      ) : assessments.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Results Header */}
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {assessments.length} assessments (Page {pagination.current_page || 1} of {pagination.total_pages || 1})
            </div>
          </div>
          
          {/* Assessment cards */}
          <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2">
            {assessments.map((assessment) => (
              <AssessmentCard
                key={assessment.name}
                assessment={assessment}
                onViewDetails={handleViewDetails}
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
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {!filters.jobPost && !filters.candidateName && !filters.updatedBy ? (
              <>
                <p className="text-gray-600 text-lg mb-2">No assessments found</p>
                <p className="text-gray-500 text-sm">Create your first assessment to get started</p>
              </>
            ) : (
              <>
                <p className="text-gray-600 text-lg mb-2">No assessments match your filters</p>
                <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
                <Button onClick={clearFilters} variant="outline" className="mt-4">
                  Clear All Filters
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Assessment Details Dialog */}
      <AssessmentDetailsDialog 
        assessment={selectedAssessment}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
};

export default AssessmentsComponent;