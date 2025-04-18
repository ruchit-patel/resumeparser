import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from 'react-router-dom'; 
import {config} from "@/config";
import { useNavigate } from 'react-router-dom';

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
    skills: []
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
          credentials: 'include', // important to send cookies
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Error in fetchSearchData:', error);
        return null;
      }
    };

  const fetchCandidateDetail = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/method/resumeparser.apis.update_profile.candidate_get/${id}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Error fetching candidate details:', error);
      return null;
    }
  };

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchCandidateDetail().then((response) => {
        if (response?.message) {
          setFormData(response.message)
          console.log('Candidate data loaded:', response.message);
        }
      }).finally(() => {
        setIsLoading(false);
      });
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
      skills: [{ skill_name: "", skill_type: type },...prev.skills]
    }));
  };

  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    updateCandidateDetail(formData).then((response) => {console.log(response)}).finally(() => {
      setIsLoading(false);
      navigate(`/resume_search/detail/${id}`)
    })
    
  };


  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col gap-3">
         <Card className="p-4">
                <CardTitle className="text-2xl font-bold item-center">Update Profile</CardTitle>
         </Card>

         {/* Loading state */}
         {isLoading && (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <LoadingSpinner />
              <p className="text-gray-600 mt-4">Loading candidates...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card className="p-4">
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
                    <Input
                        id="gender"
                        value={formData.gender}
                        onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                        className="mt-1"
                    />
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
                    <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="mt-1"
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
            </Card>

            {/* Work Summary */}
            <Card className="p-4">
                <div className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Work Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                        id="industry"
                        value={formData.industry}
                        onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                        className="mt-1"
                    />
                    </div>
                    <div>
                    <Label htmlFor="role">Role</Label>
                    <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        className="mt-1"
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
            </Card>

            {/* Skills */}
            <Card className="p-4">
                <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold">Skills</h2>
                    <div className="space-x-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => addSkill("Technical")}>
                        <Plus className="w-4 h-4 mr-1" /> Add Technical Skill
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addSkill("Soft")}>
                        <Plus className="w-4 h-4 mr-1" /> Add Soft Skill
                    </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.skills.map((skill, index) => (
                    <div className="flex gap-4 items-start">
                        <div className="flex-1">
                        <Input
                            placeholder={`${skill.skill_type} Skill`}
                            value={skill.skill_name}
                            onChange={(e) => {
                            const newSkills = [...formData.skills];
                            newSkills[index] = { ...skill, skill_name: e.target.value };
                            setFormData(prev => ({ ...prev, skills: newSkills }));
                            }}
                        />
                        </div>
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
                    </div>
                    ))}
                </div>
                </div>
            </Card>
            {/* Experience */}
            <Card className="p-4">
                <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold">Work Experience</h2>
                    <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                    <Plus className="w-4 h-4 mr-1" /> Add Experience
                    </Button>
                </div>
                {formData.experience.map((exp, index) => (
                    <Card className="p-4">
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
                        <Input
                            value={exp.role_position}
                            onChange={(e) => {
                            const newExp = [...formData.experience];
                            newExp[index] = { ...exp, role_position: e.target.value };
                            setFormData(prev => ({ ...prev, experience: newExp }));
                            }}
                            className="mt-1"
                        />
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
                    </Card>
                ))}
                </div>
            </Card>

            {/* Education */}
            <Card className="p-4">
                <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold">Education</h2>
                    <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                    <Plus className="w-4 h-4 mr-1" /> Add Education
                    </Button>
                </div>
                {formData.education.map((edu, index) => (
                    <Card className="p-4">
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
                    </Card>
                ))}
                </div>
            </Card>

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            </div>
          </form>
    </div>
  );
};

export default UpdateProfile;