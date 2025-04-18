import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";


const UpdateProfile = () => {
  const [keySkills, setKeySkills] = useState([""]);
  const [softSkills, setSoftSkills] = useState([""]);
  const [workExperience, setWorkExperience] = useState([{
    role_position: "",
    company_name: "",
    from: "",
    to: "",
    job_description: ""
  }]);
  const [education, setEducation] = useState<Education[]>([{
    course_name: "",
    school_college_name: "",
    from: "",
    to: "",
    specialization: ""
  }]);

  // Handlers for multiple entries
  const addKeySkill = () => setKeySkills([...keySkills, ""]);
  const addSoftSkill = () => setSoftSkills([...softSkills, ""]);
  const removeKeySkill = (index: number) => {
    const newSkills = keySkills.filter((_, i) => i !== index);
    setKeySkills(newSkills);
  };
  const removeSoftSkill = (index: number) => {
    const newSkills = softSkills.filter((_, i) => i !== index);
    setSoftSkills(newSkills);
  };

  const addWorkExperience = () => {
    setWorkExperience([...workExperience, {
      role_position: "",
      company_name: "",
      from: "",
      to: "",
      job_description: ""
    }]);
  };

  const addEducation = () => {
    setEducation([...education, {
      course_name: "",
      school_college_name: "",
      from: "",
      to: "",
      specialization: ""
    }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted");
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Update Profile</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your full name" />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" placeholder="Enter your age" />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" placeholder="Enter your gender" />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" />
              </div>
            </div>
          </div>

          {/* Key Skills */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Key Skills</h2>
              <Button type="button" variant="outline" size="sm" onClick={addKeySkill}>
                <Plus className="w-4 h-4 mr-2" /> Add Skill
              </Button>
            </div>
            {keySkills.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Enter a key skill"
                  value={skill}
                  onChange={(e) => {
                    const newSkills = [...keySkills];
                    newSkills[index] = e.target.value;
                    setKeySkills(newSkills);
                  }}
                />
                {keySkills.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeKeySkill(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Soft Skills */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Soft Skills</h2>
              <Button type="button" variant="outline" size="sm" onClick={addSoftSkill}>
                <Plus className="w-4 h-4 mr-2" /> Add Skill
              </Button>
            </div>
            {softSkills.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Enter a soft skill"
                  value={skill}
                  onChange={(e) => {
                    const newSkills = [...softSkills];
                    newSkills[index] = e.target.value;
                    setSoftSkills(newSkills);
                  }}
                />
                {softSkills.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeSoftSkill(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Work Summary */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Work Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" placeholder="Enter your industry" />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" placeholder="Enter your role" />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" placeholder="Enter your department" />
              </div>
              <div>
                <Label htmlFor="total_experience">Total Experience (Years)</Label>
                <Input id="total_experience" type="number" placeholder="Enter total experience" />
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Work Experience</h2>
              <Button type="button" variant="outline" size="sm" onClick={addWorkExperience}>
                <Plus className="w-4 h-4 mr-2" /> Add Experience
              </Button>
            </div>
            {workExperience.map((exp, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Role/Position</Label>
                    <Input
                      placeholder="Enter role/position"
                      value={exp.role_position}
                      onChange={(e) => {
                        const newExp = [...workExperience];
                        newExp[index] = { ...exp, role_position: e.target.value };
                        setWorkExperience(newExp);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Company Name</Label>
                    <Input
                      placeholder="Enter company name"
                      value={exp.company_name}
                      onChange={(e) => {
                        const newExp = [...workExperience];
                        newExp[index] = { ...exp, company_name: e.target.value };
                        setWorkExperience(newExp);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={exp.from}
                      onChange={(e) => {
                        const newExp = [...workExperience];
                        newExp[index] = { ...exp, from: e.target.value };
                        setWorkExperience(newExp);
                      }}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={exp.to}
                      onChange={(e) => {
                        const newExp = [...workExperience];
                        newExp[index] = { ...exp, to: e.target.value };
                        setWorkExperience(newExp);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label>Job Description</Label>
                  <Input
                    placeholder="Enter job description"
                    value={exp.job_description}
                    onChange={(e) => {
                      const newExp = [...workExperience];
                      newExp[index] = { ...exp, job_description: e.target.value };
                      setWorkExperience(newExp);
                    }}
                  />
                </div>
                {workExperience.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const newExp = workExperience.filter((_, i) => i !== index);
                      setWorkExperience(newExp);
                    }}
                  >
                    Remove Experience
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Education</h2>
              <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                <Plus className="w-4 h-4 mr-2" /> Add Education
              </Button>
            </div>
            {education.map((edu, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Course Name</Label>
                    <Input
                      placeholder="Enter course name"
                      value={edu.course_name}
                      onChange={(e) => {
                        const newEdu = [...education];
                        newEdu[index] = { ...edu, course_name: e.target.value };
                        setEducation(newEdu);
                      }}
                    />
                  </div>
                  <div>
                    <Label>School/College Name</Label>
                    <Input
                      placeholder="Enter school/college name"
                      value={edu.school_college_name}
                      onChange={(e) => {
                        const newEdu = [...education];
                        newEdu[index] = { ...edu, school_college_name: e.target.value };
                        setEducation(newEdu);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={edu.from}
                      onChange={(e) => {
                        const newEdu = [...education];
                        newEdu[index] = { ...edu, from: e.target.value };
                        setEducation(newEdu);
                      }}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={edu.to}
                      onChange={(e) => {
                        const newEdu = [...education];
                        newEdu[index] = { ...edu, to: e.target.value };
                        setEducation(newEdu);
                      }}
                    />
                  </div>
                </div>
                {education.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const newEdu = education.filter((_, i) => i !== index);
                      setEducation(newEdu);
                    }}
                  >
                    Remove Education
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Button type="submit" className="w-full">Update Profile</Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;