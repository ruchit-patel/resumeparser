import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

const JobPostForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    client: "",
    job_title: "",
    job_description: "",
    role: "",
    industry: "",
    department: "",
    employment_type: "",
    designation: "",
    key_skill: ""
  });

  const industryOptions = [
    "Information Technology (IT)",
    "Finance & Banking",
    "Healthcare & Pharmaceuticals",
    "Manufacturing & Industrial Production",
    "Retail & E-commerce",
    "Education & E-Learning",
    "Telecommunications & Media",
    "Hospitality & Tourism",
    "Energy & Utilities",
    "Transportation & Logistics",
    "Real Estate & Construction",
    "Agriculture & Agribusiness",
    "Automotive & Aerospace",
    "Consumer Goods & Services",
    "Entertainment & Leisure",
    "Legal & Compliance",
    "Insurance & Risk Management",
    "Mining & Natural Resources",
    "Professional Services",
    "Public Sector & Government",
    "Technology Hardware & Equipment",
    "Semiconductors & Electronics",
    "Renewable Energy & Sustainability",
    "Cybersecurity & Data Privacy",
    "Artificial Intelligence & Machine Learning",
    "Blockchain & Fintech",
    "Sports & Recreation",
    "Art & Culture",
    "Nonprofit & Social Impact"
  ];

  const employmentTypes = [
    "Full Time",
    "Part Time", 
    "Contract",
    "Temporary",
    "Volunteer",
    "Intern",
    "Freelance",
    "Remote",
    "Hybrid",
    "Other"
  ];

  const createJobPost = async (data) => {
    try {
      const csrfToken = window.csrf_token;
      const response = await fetch('/api/method/resumeparser.apis.custom_apis.create_job_post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error in createJobPost:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!formData.client.trim()) {
        alert('Please enter client name');
        return;
      }
      
      if (!formData.job_title.trim()) {
        alert('Please enter a job title');
        return;
      }
      
      if (!formData.job_description.trim()) {
        alert('Please enter a job description');
        return;
      }

      const response = await createJobPost(formData);
      if (response && response.message) {
        console.log('Job post created successfully:', response);
        setShowSuccess(true);
        // Reset form
        setFormData({
          client: "",
          job_title: "",
          job_description: "",
          role: "",
          industry: "",
          department: "",
          employment_type: "",
          designation: "",
          key_skill: ""
        });
        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert('Failed to create job post. Please try again.');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('An error occurred while creating the job post.');
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Job Post Created Successfully!</h3>
              <p className="text-sm text-green-600">Your job posting has been created and is now available.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="border-b pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create New Job Post</h2>
          <p className="text-gray-600 text-sm mt-1">Fill out the form below to create a new job posting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client">Client Name *</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                    placeholder="Enter client name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="job_title">Job Title *</Label>
                  <Input
                    id="job_title"
                    value={formData.job_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                    placeholder="Enter job title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="Enter role"
                  />
                </div>

                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                    placeholder="Enter designation"
                  />
                </div>

                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Enter department"
                  />
                </div>

                <div>
                  <Label htmlFor="employment_type">Employment Type</Label>
                  <Select
                    value={formData.employment_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, employment_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="job_description">Job Description *</Label>
                <Textarea
                  id="job_description"
                  value={formData.job_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, job_description: e.target.value }))}
                  placeholder="Enter detailed job description..."
                  rows={5}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Skills Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="key_skill">Key Skills</Label>
                <Input
                  id="key_skill"
                  placeholder="Enter skills separated by commas (e.g., Python, JavaScript, React, Node.js)"
                  value={formData.key_skill}
                  onChange={(e) => setFormData(prev => ({ ...prev, key_skill: e.target.value }))}
                />
                <p className="text-sm text-gray-500 mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <strong>Note:</strong> Please enter skills separated by commas
                </p>
                
                {/* Show skills as badges if entered */}
                {formData.key_skill && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills Preview:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.key_skill.split(',').map((skill, index) => {
                        const trimmedSkill = skill.trim();
                        return trimmedSkill ? (
                          <Badge key={index} variant="secondary">
                            {trimmedSkill}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="min-w-[150px]"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Creating...</span>
                </>
              ) : (
                'Create Job Post'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostForm;