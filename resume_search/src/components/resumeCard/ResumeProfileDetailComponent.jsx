import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch" 
import React, { useEffect, useState } from "react"
import {config} from '@/config';

const ResumeProfileDetailComponent = ({candidate}) => {
  const [isApproved, setIsApproved] = useState(candidate?.resume?.resume_approval || false)

  const handleApprovalChange = async (checked) => {
    setIsApproved(checked)
    try {
      const apiEndPoint = `api/method/resumeparser.apis.update_profile.approve_resume/${checked}/${candidate.id}`
      const response = await fetch(`${config.backendUrl}/${apiEndPoint}`)

      if (!response.ok) {
        throw new Error('Failed to update approval status')
      }

      const data = await response.json()
      console.log('Approval status updated:', data)
      setIsApproved(data.status || checked);
    } catch (error) {
      console.error('Error updating approval:', error)
      setIsApproved(!checked);
    }
  }

  useEffect(() => {
    if (candidate?.resume?.resume_approval !== undefined) {
      setIsApproved(candidate.resume.resume_approval)
      console.log("Initial approval status:", candidate.resume.resume_approval)
    }
  }, [candidate])


  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow p-6 relative">
      {/* Sticky Approve Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white p-3 rounded-lg shadow-md">
        <Switch 
          checked={isApproved}
          onCheckedChange={handleApprovalChange}
          className="data-[state=checked]:bg-green-500"
        />
        <span className="text-sm font-medium">
          {isApproved ? 'Resume is Approved' : 'Approve Resume'}
        </span>
      </div>

        {/* All Content */}
        {/* <div className="w-full mx-auto bg-white rounded-lg shadow p-6"> */}
        <div>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="profile"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:text-black data-[state=active]:font-semibold py-2 px-4 h-auto bg-transparent"
              >
                Profile detail
              </TabsTrigger>
              <TabsTrigger
                value="cv"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:text-black data-[state=active]:font-semibold py-2 px-4 h-auto bg-transparent"
              >
                Attached CV
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-0">
              <div className="flex mt-6 mb-8">
                <div className="w-1 bg-blue-600 mr-4 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">
                  Seasoned professional with {candidate.experience[0].experience} years of experience. {candidate.experience[0].job_description}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="font-medium text-lg mb-3">Key skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {candidate.skills.TechnicalSkill.map((skill) => (
                        <Badge
                            key={skill}
                            variant="outline"
                            className="bg-gray-100 hover:bg-gray-100 text-black rounded-md font-normal py-1 px-3">
                            {skill}
                        </Badge>
                    ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-medium text-lg mb-3">Soft skills</h3>
                <div className="flex flex-wrap gap-2">
                {candidate.skills.Soft.map((skill) => (
                        <Badge
                            key={skill}
                            variant="outline"
                            className="bg-gray-100 hover:bg-gray-100 text-black rounded-md font-normal py-1 px-3">
                            {skill}
                        </Badge>
                    ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-medium text-lg mb-3">Work summary</h3>
                <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm">
                  <div className="text-gray-500">Industry</div>
                  <div>{candidate.workSummary.industry || "-"}</div>
                  <div className="text-gray-500">Department</div>
                  <div>{candidate.workSummary.department ? `${candidate.workSummary.department}` : "-"}</div>
                  <div className="text-gray-500">Designation</div>
                  <div>{candidate.workSummary.role || "-"}</div>
                  <div className="text-gray-500">Total Experience</div>
                  <div>{candidate.basicInfo.total_experience ? `${candidate.basicInfo.total_experience} Years` : "-"}</div>
                  <div className="text-gray-500">Annual Salary</div>
                  <div>{candidate.basicInfo.annual_salary ? `${candidate.basicInfo.annual_salary} Lakhs` : "-"}</div>
                  <div className="text-gray-500">Notice Period</div>
                  <div>{candidate.basicInfo.notice_period ? `${candidate.basicInfo.notice_period} Days` : "-"}</div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-medium text-lg mb-3">Work experience</h3>

                {candidate.experience.map((exp, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center overflow-hidden">
                        <span className="text-blue-600 font-semibold">{exp.company_name?.[0] || 'C'}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{exp.role_position} at {exp.company_name}</h4>
                        <p className="text-sm text-gray-500">{exp.from} {exp.to ? `to ${exp.to}` : '(Current)'}</p>
                      </div>
                    </div>

                    <p className="text-sm mt-2">
                      {exp.job_description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Education Section */}
              <div className="mb-8">
                <h3 className="font-medium text-lg mb-3">Education</h3>
                <div className="space-y-4">
                  {candidate.education.map((edu, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-amber-50 rounded-md flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-amber-400"
                        >
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-blue-600">{edu.course_name}</h4>
                          {edu.specialization && (
                            <Badge
                              variant="outline"
                              className="bg-amber-50 hover:bg-amber-50 text-amber-600 rounded-sm text-xs font-normal py-0 px-1 h-5"
                            >
                              {edu.specialization}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">
                          {edu.school_college_name}
                          {edu.school_college_city && `, ${edu.school_college_city}`}
                        </p>
                        <p className="text-xs text-gray-500">{edu.from} - {edu.to}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certification Section */}
              {candidate.certificates && candidate.certificates.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-3">Certification</h3>
                  <div className="space-y-4">
                    {candidate.certificates.map((cert, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-md flex items-center justify-center border">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-400"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold">{cert.certificate_name || '-'}</h4>
                          <p className="text-sm text-gray-700">{cert.provider || '-'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {candidate.accomplishments && candidate.accomplishments.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-3">Accomplishments</h3>
                  <div className="space-y-4">
                    {candidate.accomplishments.map((acc, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-md flex items-center justify-center border">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-400"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold">{acc.accomplishment || '-'}</h4>
                          <p className="text-sm text-gray-700">{acc.description || '-'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other details Section */}
              {/* <div className="mb-8">
                <h3 className="font-medium text-lg mb-3">Other details</h3>

                <div className="mb-6">
                  <h4 className="font-medium mb-2">Languages known</h4>
                  <div className="space-y-2 text-sm">
                    {candidate.languages.map((language, index) => (
                      <div key={index}>
                        <span className="text-gray-700">{language.name} - {language.level}</span>
                        <span className="text-gray-500"> ( {language.abilities.join(",")} )</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}

              {/* Personal details Section */}
              <div className="mb-8">
                <h3 className="font-medium text-lg mb-3">Personal details</h3>
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">Date of Birth</div>
                    <div>{candidate.basicInfo.date_of_birth}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Gender</div>
                    <div>{candidate.basicInfo.gender}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Marital status</div>
                    <div>{candidate.basicInfo.maritalStatus}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Category</div>
                    <div>{candidate.basicInfo.castCategory}</div>
                  </div>
                </div>  
              </div>

              {/* Desired job detail Section */}
              <div className="mb-8">
                <h3 className="font-medium text-lg mb-3">Desired job detail</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">Current Job Type</div>
                    <div>{candidate.desiredJob.currentJobType || "-"}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Seeking Job Type</div>
                    <div>{candidate.desiredJob.seekingJobType || "-"}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-500 mb-1">Seeking Job Locations</div>
                    <div>
                      {candidate.desiredJob.seekingJobLocations && candidate.desiredJob.seekingJobLocations.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {candidate.desiredJob.seekingJobLocations.map((location, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-blue-50 hover:bg-blue-50 text-blue-600 rounded-md font-normal py-1 px-2"
                            >
                              {location}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Attached CV Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg">Attached CV</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500">Last updated on {candidate.resume.lastUpdate}</span>
                  </div>
                </div>
                <div className="border rounded-md p-8 flex items-center justify-center">
                <embed src={candidate.resume.link} width="100%" height="900px" type="application/pdf" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cv">
              <div className="border rounded-md p-8 flex items-center justify-center">
                <embed
                  src={candidate.resume.link}
                  width="100%"
                  height="900px"
                  type="application/pdf"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
    </div>
  )
}

export default ResumeProfileDetailComponent
