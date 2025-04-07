import React from 'react'
import ResumeProfileDetailComponent from '../components/resumeCard/ResumeProfileDetailComponent'
import CandidateCard from '../components/resumeCard/CandidateCardComponent'
const ResumeDetailPage = () => {

  const candidate = {
    id: 1,
    name: "Vignesh Yadavar",
    experience: "2",
    currentSalary: "2.0",
    expectedSalary: "6.5",
    location: "Dadra & Nagar Haveli",
    role: "Software Developer",
    company: "Meril",
    joinedDate: "Feb '23",
    duration: "1 Month",
    education: {
      degree: "B.Tech/B.E.",
      specialization: "Computers",
      year: "2022",
      university: "Parul University",
      location: "Vadodara",
      type: "UG"
    },
    preferredLocations: ["Ahmedabad", "Pune", "Remote", "Tirunelveli"],
    email: "vigneshyadavar786@gmail.com",
    keySkills: ["Python", "JavaScript", "React", "Node.js"],
    additionalSkills: ["SQL", "Git", "Agile", "MongoDB"],
    workExperience: {
      total: "2 years",
      timeline: [
        {
          role: "Software Developer",
          company: "Meril",
          duration: "1 Month",
          startDate: "Feb 2023",
          current: true,
          responsibilities: [
            "Developed and maintained web applications",
            "Implemented new features and optimizations",
            "Collaborated with cross-functional teams"
          ]
        }
      ]
    },
    certifications: [
      {
        name: "Frappe Framework V15",
        provider: "Frappe",
        year: "2023",
        validUntil: "2025"
      }
    ],
    languages: [
      { name: "English", level: "Beginner", skills: ["Read", "Write", "Speak"] },
      { name: "Hindi", level: "Proficient", skills: ["Read", "Write", "Speak"] },
      { name: "Gujarati", level: "Beginner", skills: ["Read", "Write", "Speak"] },
      { name: "Tamil", level: "Beginner", skills: ["Speak"] }
    ],
    personalDetails: {
      dateOfBirth: "30 Apr 1999",
      gender: "Male",
      maritalStatus: "Single/unmarried",
      category: "General",
      physicallyChalleneged: "No"
    },
    desiredJob: {
      type: "Permanent",
      employmentStatus: "Full time",
      preferredShift: "Day",
      expectedJoinTime: "Immediate"
    },
    resumeInfo: {
      lastUpdated: "9 Nov, '24",
      url: "Dhruv_Resume.pdf"
    },
    profileStats: {
      similarProfiles: 12,
      profileCompleteness: 85,
      lastActivity: "2 days ago",
      isNewProfile: true,
      isPremiumInstitute: true,
      hasVerifiedSkills: true
    }
  }

  const handleSelectCandidate = (id, selected) => {
    console.log(id, selected)
    }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
      <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onSelect={handleSelectCandidate}
                selected={false}
              />
      <ResumeProfileDetailComponent candidate={candidate}/>
    </main>
  )
}

export default ResumeDetailPage