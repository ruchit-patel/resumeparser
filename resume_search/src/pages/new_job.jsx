import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom';
import { config } from "@/config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NewJobPost = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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

      // Send data as is - key_skill is already a string
      const dataToSend = formData;
      
      const response = await createJobPost(dataToSend);
      if (response && response.message) {
        console.log('Job post created successfully:', response);
        alert('Job post created successfully!');
        navigate('/app/resume-list');
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
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Create New Job Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Job Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Job Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="client">Client *</Label>
                    <Input
                      id="client"
                      value={formData.client}
                      onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                      className="mt-1"
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
                      className="mt-1"
                      placeholder="Enter job title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      value={formData.designation}
                      onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                      className="mt-1"
                      placeholder="Enter designation"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="mt-1"
                      placeholder="Enter role"
                    />
                  </div>

                  <div>
                    <Label htmlFor="employment_type">Employment Type</Label>
                    <Select
                      value={formData.employment_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, employment_type: value }))}
                    >
                      <SelectTrigger id="employment_type" className="mt-1">
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger id="industry" className="mt-1">
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
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="mt-1"
                      placeholder="Enter department"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="job_description">Job Description *</Label>
                  <Textarea
                    id="job_description"
                    value={formData.job_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, job_description: e.target.value }))}
                    className="mt-1"
                    placeholder="Enter detailed job description..."
                    rows={6}
                    required
                  />
                </div>
              </div>

              {/* Key Skills Section */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h2 className="text-xl font-semibold">Key Skills</h2>
                </div>
                
                <div>
                  <Input
                    placeholder="Enter skills separated by commas (e.g., Python, JavaScript, React, Node.js)"
                    value={formData.key_skill}
                    onChange={(e) => setFormData(prev => ({ ...prev, key_skill: e.target.value }))}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>Note:</strong> Please enter skills separated by commas (comma separated format)
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-2">Creating Job Post...</span>
                    </>
                  ) : (
                    'Create Job Post'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewJobPost;