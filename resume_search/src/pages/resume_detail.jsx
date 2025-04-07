import React from 'react'
import ResumeProfileDetailComponent from '../components/resumeCard/ResumeProfileDetailComponent'
import CandidateCard from '../components/resumeCard/CandidateCardComponent'
const ResumeDetailPage = () => {

  const candidate = {
    id: 1,
  name: "John Doe",
  experience: "5 years",
  salary: "5-7 LPA",
  location: "New York, NY",
  currentJob: "Software Engineer",
  company: "Tech Corp",
  education: "B.Tech in Computer Science",
  preferredLocations: ["New York, NY", "San Francisco, CA"],
  keySkills: ["React", "Node.js", "Python"],
  additionalSkills: ["SQL", "Git", "Agile"],
      similarProfiles: 12,
  photo: "https://example.com/photo.jpg", // Replace with actual photo URL
  profileSummary: 5,
  department: "Engineering",
  industry: "IT",
      isNewProfile: true,
      isPremiumInstitute: true,
  hasVerifiedSkills: true,
  lastModified: "2 days ago"
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