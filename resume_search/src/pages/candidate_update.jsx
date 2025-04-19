import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useNavigate } from 'react-router-dom';
import { config } from "@/config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AutocompleteInput from '@/components/common/AutoCompleteInputComponent';
const isFormVisible = true; // Can be moved to a config file or made dynamic

const UpdateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    candidate_name: "",
    date_of_birth: null,
    address: "",
    gender: "",
    mobile_number: "",
    email: "",
    city: "",
    age: null,
    industry: "",
    total_experience: 0,
    role: "",
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certificates: [],
    accomplishments: []
  });

  const updateCandidateDetail = async (data) => {
    try {
      const csrfToken = window.csrf_token;
      const response = await fetch(`${config.backendUrl}/api/method/resumeparser.apis.update_profile.candidate_update/${id}`, {
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
      console.error('Error in updateCandidateDetail:', error);
      return null;
    }
  };

  const fetchCandidateDetail = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/method/resumeparser.apis.update_profile.candidate_get/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      return null;
    }
  };

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchCandidateDetail()
        .then((response) => {
          if (response?.message) {
            setFormData(response.message);
            console.log('Candidate data loaded:', response.message);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        school_college_name: "",
        school_college_city: null,
        course_name: "",
        specialization: null,
        from: "",
        to: null,
        evaluation_score: null
      }]
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company_name: "",
        role_position: "",
        from: "",
        to: null,
        current_position: false,
        location: null,
        job_description: "",
        url: null,
        project_department: null
      }]
    }));
  };

  const addSkill = (type) => {
    setFormData(prev => ({
      ...prev,
      skills: [{ skill_name: "", skill_type: type }, ...prev.skills]
    }));
  };
  

  const addCertificate = () => {
    setFormData(prev => ({
      ...prev,
      certificates: [...prev.certificates, {
        certificate_name: "",
        provider: "",
        issue_date: null,
        description: null,
        url: null
      }]
    }));
  };

  const addAccomplishment = () => {
    setFormData(prev => ({
      ...prev,
      accomplishments: [...prev.accomplishments, {
        accomplishment: "",
        description: null,
        when: null,
        url: null
      }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await updateCandidateDetail(formData);
      if (response) {
        console.log('Profile updated successfully:', response);
        navigate(`/resume_search/detail/${id}`);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Scrollable Form Side */}
      <div className="w-3/5 overflow-y-auto" style={{ height: "100vh" }}>
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Update Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center p-6">
                  <LoadingSpinner />
                  <p className="text-gray-600 mt-4">Loading profile...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {isFormVisible && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold border-b pb-2">Personal Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="candidate_name">Full Name</Label>
                          <Input
                            id="candidate_name"
                            value={formData.candidate_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, candidate_name: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="mobile_number">Mobile Number</Label>
                          <Input
                            id="mobile_number"
                            value={formData.mobile_number}
                            onChange={(e) => setFormData(prev => ({ ...prev, mobile_number: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={formData.gender}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                          >
                            <SelectTrigger id="gender" className="mt-1">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="date_of_birth">Date of Birth</Label>
                          <Input
                            id="date_of_birth"
                            type="date"
                            value={formData.date_of_birth || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">City</Label>
                          <AutocompleteInput 
                              placeholder={"Add City"} 
                              inputValue={formData.city} 
                              setInputValue={(value) => setFormData(prev => ({ ...prev, city: value }))}
                              apiEndPoint = {"api/method/resumeparser.apis.search_apis.seach_candidate_location"}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {isFormVisible && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold border-b pb-2">Work Summary</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <AutocompleteInput 
                              placeholder={"Add Industry"} 
                              inputValue={formData.industry} 
                              setInputValue={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                              apiEndPoint = {"api/method/resumeparser.apis.search_apis.seach_candidate_industry"}
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <AutocompleteInput 
                              placeholder={"Add Role"} 
                              inputValue={formData.role} 
                              setInputValue={(value) => setFormData(prev => ({ ...prev, role: value }))}
                              apiEndPoint = {"api/method/resumeparser.apis.search_apis.seach_candidate_role"}
                          />
                        </div>
                        <div>
                          <Label htmlFor="total_experience">Total Experience (Years)</Label>
                          <Input
                            id="total_experience"
                            type="number"
                            step="0.1"
                            value={formData.total_experience}
                            onChange={(e) => setFormData(prev => ({ ...prev, total_experience: parseFloat(e.target.value) }))}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h2 className="text-xl font-semibold">Skills</h2>
                      {isFormVisible && (
                        <div className="space-x-2">
                          <Button type="button"  variant="outline" size="sm" onClick={() => addSkill("Technical")}>
                            <Plus className="w-4 h-4 mr-1" /> Add Technical Skill
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => addSkill("Soft")}>
                            <Plus className="w-4 h-4 mr-1" /> Add Soft Skill
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.skills.map((skill, index) => (
                        <div key={index} className="flex gap-2 items-center">

                              {/* <AutocompleteInput 
                                placeholder={"Add Role"} 
                                inputValue={skill.skill_name} 
                                setInputValue={(value) => {
                                  const newSkills = [...formData.skills];
                                  newSkills[index] = { ...skill, skill_name:value };
                                  setFormData(prev => ({ ...prev, skills: newSkills }));
                                }}
                                apiEndPoint = {"api/method/resumeparser.apis.search_apis.seach_candidate_skills"}
                              /> */}


                          <Input
                            placeholder={`${skill.skill_type} Skill`}
                            value={skill.skill_name}
                            onChange={(e) => {
                              const newSkills = [...formData.skills];
                              newSkills[index] = { ...skill, skill_name: e.target.value };
                              setFormData(prev => ({ ...prev, skills: newSkills }));
                            }}
                            className="flex-1"
                            readOnly={!isFormVisible && skill.skill_name !== ""}
                          />
                          {isFormVisible && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                const newSkills = formData.skills.filter((_, i) => i !== index);
                                setFormData(prev => ({ ...prev, skills: newSkills }));
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {isFormVisible && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-xl font-semibold">Work Experience</h2>
                        <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                          <Plus className="w-4 h-4 mr-1" /> Add Experience
                        </Button>
                      </div>
                      {formData.experience.map((exp, index) => (
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Company Name</Label>
                              <Input
                                value={exp.company_name}
                                onChange={(e) => {
                                  const newExp = [...formData.experience];
                                  newExp[index] = { ...exp, company_name: e.target.value };
                                  setFormData(prev => ({ ...prev, experience: newExp }));
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Role/Position</Label>
 
                              <AutocompleteInput 
                                placeholder={"Add Role"} 
                                inputValue={exp.role_position} 
                                setInputValue={(value) => {
                                  const newExp = [...formData.experience];
                                  newExp[index] = { ...exp, role_position: value };
                                  setFormData(prev => ({ ...prev, experience: newExp }));
                                }}
                                apiEndPoint = {"api/method/resumeparser.apis.search_apis.seach_candidate_role"}
                              />

                              {/* <Input
                                value={exp.role_position}
                                onChange={(e) => {
                                  const newExp = [...formData.experience];
                                  newExp[index] = { ...exp, role_position: e.target.value };
                                  setFormData(prev => ({ ...prev, experience: newExp }));
                                }}
                                className="mt-1"
                              /> */}
                            </div>
                            <div>
                              <Label>Start Date</Label>
                              <Input
                                type="date"
                                value={exp.from}
                                onChange={(e) => {
                                  const newExp = [...formData.experience];
                                  newExp[index] = { ...exp, from: e.target.value };
                                  setFormData(prev => ({ ...prev, experience: newExp }));
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input
                                type="date"
                                value={exp.to || ''}
                                onChange={(e) => {
                                  const newExp = [...formData.experience];
                                  newExp[index] = { ...exp, to: e.target.value || null };
                                  setFormData(prev => ({ ...prev, experience: newExp }));
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label>Job Description</Label>
                              <Textarea
                                value={exp.job_description}
                                onChange={(e) => {
                                  const newExp = [...formData.experience];
                                  newExp[index] = { ...exp, job_description: e.target.value };
                                  setFormData(prev => ({ ...prev, experience: newExp }));
                                }}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          {formData.experience.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => {
                                const newExp = formData.experience.filter((_, i) => i !== index);
                                setFormData(prev => ({ ...prev, experience: newExp }));
                              }}
                              className="mt-4"
                            >
                              Remove Experience
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {isFormVisible && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-xl font-semibold">Education</h2>
                        <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                          <Plus className="w-4 h-4 mr-1" /> Add Education
                        </Button>
                      </div>
                      {formData.education.map((edu, index) => (
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>School/College Name</Label>
                              <Input
                                value={edu.school_college_name}
                                onChange={(e) => {
                                  const newEdu = [...formData.education];
                                  newEdu[index] = { ...edu, school_college_name: e.target.value };
                                  setFormData(prev => ({ ...prev, education: newEdu }));
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Course Name</Label>
                              <Input
                                value={edu.course_name}
                                onChange={(e) => {
                                  const newEdu = [...formData.education];
                                  newEdu[index] = { ...edu, course_name: e.target.value };
                                  setFormData(prev => ({ ...prev, education: newEdu }));
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Specialization</Label>
                              <Input
                                value={edu.specialization || ''}
                                onChange={(e) => {
                                  const newEdu = [...formData.education];
                                  newEdu[index] = { ...edu, specialization: e.target.value };
                                  setFormData(prev => ({ ...prev, education: newEdu }));
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>City</Label>
                              <Input
                                value={edu.school_college_city || ''}
                                onChange={(e) => {
                                  const newEdu = [...formData.education];
                                  newEdu[index] = { ...edu, school_college_city: e.target.value };
                                  setFormData(prev => ({ ...prev, education: newEdu }));
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Start Date</Label>
                              <Input
                                type="date"
                                value={edu.from}
                                onChange={(e) => {
                                  const newEdu = [...formData.education];
                                  newEdu[index] = { ...edu, from: e.target.value };
                                  setFormData(prev => ({ ...prev, education: newEdu }));
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input
                                type="date"
                                value={edu.to || ''}
                                onChange={(e) => {
                                  const newEdu = [...formData.education];
                                  newEdu[index] = { ...edu, to: e.target.value || null };
                                  setFormData(prev => ({ ...prev, education: newEdu }));
                                }}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          {formData.education.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => {
                                const newEdu = formData.education.filter((_, i) => i !== index);
                                setFormData(prev => ({ ...prev, education: newEdu }));
                              }}
                              className="mt-4"
                            >
                              Remove Education
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {isFormVisible && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-xl font-semibold">Certificates</h2>
                        <Button type="button" variant="outline" size="sm" onClick={addCertificate}>
                          <Plus className="w-4 h-4 mr-1" /> Add Certificate
                        </Button>
                      </div>
                      {formData.certificates.map((cert, index) => (
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Certificate Name</Label>
                              <Input
                                value={cert.certificate_name}
                                onChange={(e) => {
                                  const newCerts = [...formData.certificates];
                                  newCerts[index] = { ...cert, certificate_name: e.target.value };
                                  setFormData(prev => ({ ...prev, certificates: newCerts }));
                                }}
                                className="mt-1"
                                readOnly={!isFormVisible && cert.certificate_name !== ""}
                              />
                            </div>
                            <div>
                              <Label>Provider</Label>
                              <Input
                                value={cert.provider}
                                onChange={(e) => {
                                  const newCerts = [...formData.certificates];
                                  newCerts[index] = { ...cert, provider: e.target.value };
                                  setFormData(prev => ({ ...prev, certificates: newCerts }));
                                }}
                                className="mt-1"
                                readOnly={!isFormVisible && cert.provider !== ""}
                              />
                            </div>
                            <div>
                              <Label>Issue Date</Label>
                              <Input
                                type="date"
                                value={cert.issue_date || ''}
                                onChange={(e) => {
                                  const newCerts = [...formData.certificates];
                                  newCerts[index] = { ...cert, issue_date: e.target.value };
                                  setFormData(prev => ({ ...prev, certificates: newCerts }));
                                }}
                                className="mt-1"
                                readOnly={!isFormVisible && cert.issue_date !== null}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label>Description</Label>
                              <Textarea
                                value={cert.description || ''}
                                onChange={(e) => {
                                  const newCerts = [...formData.certificates];
                                  newCerts[index] = { ...cert, description: e.target.value };
                                  setFormData(prev => ({ ...prev, certificates: newCerts }));
                                }}
                                className="mt-1"
                                readOnly={!isFormVisible && cert.description !== null}
                              />
                            </div>
                          </div>
                          {isFormVisible && formData.certificates.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => {
                                const newCerts = formData.certificates.filter((_, i) => i !== index);
                                setFormData(prev => ({ ...prev, certificates: newCerts }));
                              }}
                              className="mt-4"
                            >
                              Remove Certificate
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {isFormVisible && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-xl font-semibold">Accomplishments</h2>
                        <Button type="button" variant="outline" size="sm" onClick={addAccomplishment}>
                          <Plus className="w-4 h-4 mr-1" /> Add Accomplishment
                        </Button>
                      </div>
                      {formData.accomplishments.map((acc, index) => (
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <Label>Accomplishment</Label>
                              <Input
                                value={acc.accomplishment}
                                onChange={(e) => {
                                  const newAccomplishments = [...formData.accomplishments];
                                  newAccomplishments[index] = { ...acc, accomplishment: e.target.value };
                                  setFormData(prev => ({ ...prev, accomplishments: newAccomplishments }));
                                }}
                                className="mt-1"
                                readOnly={!isFormVisible && acc.accomplishment !== ""}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label>Description</Label>
                              <Textarea
                                value={acc.description || ''}
                                onChange={(e) => {
                                  const newAccomplishments = [...formData.accomplishments];
                                  newAccomplishments[index] = { ...acc, description: e.target.value };
                                  setFormData(prev => ({ ...prev, accomplishments: newAccomplishments }));
                                }}
                                className="mt-1"
                                readOnly={!isFormVisible && acc.description !== null}
                              />
                            </div>
                          </div>
                          {isFormVisible && formData.accomplishments.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => {
                                const newAccomplishments = formData.accomplishments.filter((_, i) => i !== index);
                                setFormData(prev => ({ ...prev, accomplishments: newAccomplishments }));
                              }}
                              className="mt-4"
                            >
                              Remove Accomplishment
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4">
                    <Button type="submit" className="w-full">
                      Update Profile
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Fixed PDF Viewer Side */}
      <div className="w-2/5 bg-gray-100" style={{ position: "sticky", top: 0, height: "100vh" }}>
        <div className="h-full flex flex-col">
          <div className="bg-white p-4 border-b">
            <h2 className="text-xl font-semibold">Resume Preview</h2>
          </div>
          <div className="flex-1 p-4">
            {formData.resume_url ? (
              <iframe 
                src={formData.resume_url}
                className="w-full h-full border rounded-md"
                title="Resume PDF"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200 rounded-md">
                <p className="text-gray-600">Resume not available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;