import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const ResumeProfileDetailComponent = ({candidate}) => {
  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow p-6">
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
              Seasoned professional with {candidate.summary.years} years of experience. {candidate.summary.description}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="font-medium text-lg mb-3">Key skills</h3>
            <div className="flex flex-wrap gap-2 mb-4">
                {candidate.skills.keySkills.map((skill) => (
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
            <h3 className="font-medium text-lg mb-3">May also know</h3>
            <div className="flex flex-wrap gap-2">
            {candidate.skills.additionalSkills.map((skill) => (
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
              <div>{candidate.workSummary.industry}</div>
              <div className="text-gray-500">Department</div>
              <div>{candidate.workSummary.department}</div>
              <div className="text-gray-500">Role</div>
              <div>{candidate.workSummary.role}</div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-medium text-lg mb-3">Work experience</h3>

            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center overflow-hidden">
                <span className="text-blue-600 font-semibold">M</span>
              </div>
              <div>
                <h4 className="font-semibold">{candidate.workSummary.role} at {candidate.workSummary.currentCompany}</h4>
                <p className="text-sm text-gray-500">Feb '23 till date (2y 1m)</p>
              </div>
            </div>

            <p className="text-sm mt-2">
              Software Developer with 1.8 years of experience in <span className="bg-yellow-100 px-1">.NET</span>,{" "}
              <span className="bg-yellow-100 px-1">.NET Core</span> and significant experience in{" "}
              <span className="bg-yellow-100 px-1">Frappe Framework</span>
            </p>
          </div>

          {/* Education Section */}
          <div className="mb-8">
            <h3 className="font-medium text-lg mb-3">Education</h3>
            <div className="flex items-start gap-3">
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
                  <h4 className="font-semibold text-blue-600">{candidate.education.degree}</h4>
                  <Badge
                    variant="outline"
                    className="bg-amber-50 hover:bg-amber-50 text-amber-600 rounded-sm text-xs font-normal py-0 px-1 h-5"
                  >
                    {candidate.education.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{candidate.education.university}, {candidate.education.location}</p>
              </div>
            </div>
          </div>

          {/* Certification Section */}
          <div className="mb-8">
            <h3 className="font-medium text-lg mb-3">Certification</h3>
            <div className="flex items-start gap-3">
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
                <h4 className="font-semibold">{candidate.certification.name}</h4>
                <p className="text-sm text-gray-700">{candidate.certification.provider}</p>
              </div>
            </div>
          </div>

          {/* Other details Section */}
          <div className="mb-8">
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
          </div>

          {/* Personal details Section */}
          <div className="mb-8">
            <h3 className="font-medium text-lg mb-3">Personal details</h3>
            <div className="grid grid-cols-5 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Date of Birth</div>
                <div>{candidate.personalDetails.dateOfBirth}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Gender</div>
                <div>{candidate.personalDetails.gender}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Marital status</div>
                <div>{candidate.personalDetails.maritalStatus}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Category</div>
                <div>{candidate.personalDetails.castCategory}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Physically Challenged</div>
                <div>{candidate.personalDetails.physicallyChallenged}</div>
              </div>
            </div>
          </div>

          {/* Desired job detail Section */}
          <div className="mb-8">
            <h3 className="font-medium text-lg mb-3">Desired job detail</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Job Type</div>
                <div>{candidate.desiredJob.employmentType}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Employment status</div>
                <div>{candidate.desiredJob.employmentStatus}</div>
              </div>
            </div>
          </div>

          {/* Attached CV Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-lg">Attached CV</h3>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">Last updated on {candidate.resume.lastUpdate}</span>
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
                  className="text-gray-500"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
            </div>
            <div className="border rounded-md p-8 flex items-center justify-center">
             <embed src={candidate.resume.link} width="100%" height="900px" type="application/pdf" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cv">
        <div className="border rounded-md p-8 flex items-center justify-center">
             <embed src={candidate.resume.link} width="100%" height="900px" type="application/pdf" />
            </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ResumeProfileDetailComponent
