"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Download, FileText, Clock, MessageSquare, 
  Bookmark, Phone, AlertCircle ,MapPin,Wallet,BriefcaseBusiness} from "lucide-react"

import { cn } from "@/lib/utils"


const CandidateCard = ({ candidate, onSelect, selected = false }) => {
  const [saved, setSaved] = useState(false)

  const handleCheckboxChange = (checked) => {
    if (onSelect) {
      onSelect(candidate.id, checked)
    }
  }

  return (
<Card className="w-full overflow-hidden border-gray-200">
      <CardContent className="p-0">
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="w-4/6">
              {/* Header with name and checkbox */}
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  id={`candidate-${candidate.id}`}
                  checked={selected}
                  onCheckedChange={handleCheckboxChange}
                  className="h-4 w-4"
                />
                <label htmlFor={`candidate-${candidate.id}`} className="text-base font-medium cursor-pointer">
                  {candidate.name}
                </label>
              </div>

              {/* Basic info badges */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-gray-100 text-gray-500 font-normal rounded-md px-1.5 py-0.5">
                    <BriefcaseBusiness/> {candidate.experience}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-gray-100 text-gray-500 font-normal rounded-md px-1.5 py-0.5">
                    <Wallet/> {candidate.salary}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="bg-gray-100 text-gray-500 font-normal rounded-md px-1.5 py-0.5">
                  <MapPin/> {candidate.location}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                {/* Row */}
                <div className="flex items-start">
                  <div className="w-32 text-sm font-medium text-gray-500 shrink-0">Current</div>
                  <div className="text-sm text-gray-800">
                    <span className="text-green-700 font-medium">{candidate.currentJob}</span> at {candidate.company}
                  </div>
                </div>

                {/* Row */}
                <div className="flex items-start">
                  <div className="w-32 text-sm font-medium text-gray-500 shrink-0">Education</div>
                  <div className="text-sm text-gray-800">{candidate.education}</div>
                </div>

                {/* Row */}
                <div className="flex items-start">
                  <div className="w-32 text-sm font-medium text-gray-500 shrink-0">Pref. locations</div>
                  <div className="text-sm text-gray-800">
                    {candidate.preferredLocations.join(", ")}
                  </div>
                </div>

                {/* Row */}
                <div className="flex items-start">
                  <div className="w-32 text-sm font-medium text-gray-500 shrink-0">Key skills</div>
                  <div className="flex flex-wrap gap-1 text-sm text-gray-800">
                    {candidate.keySkills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 font-normal"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Row */}
                <div className="flex items-start">
                  <div className="w-32 text-sm font-medium text-gray-500 shrink-0">May also know</div>
                  <div className="flex flex-wrap gap-1 text-sm text-gray-800">
                    {candidate.additionalSkills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 font-normal"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>



              {/* Similar profiles link */}
              <div className="mt-4">
                <Button variant="link" size="sm" className="text-blue-600 p-0 h-auto">
                  {candidate.similarProfiles} similar profiles
                </Button>
              </div>
            </div>

            {/* Right side with photo and actions */}
            <div className="w-2/6 flex flex-col items-center text-center p-4 bg-white border-l-2 border-l-blue-600 rounded-lg shadow-sm overflow-y-auto">
              {/* Avatar + Bookmark */}
              <div className="relative">
                <Avatar className="h-20 w-20 rounded-full border">
                  <AvatarImage src={candidate.photo} alt={candidate.name} />
                  <AvatarFallback className="bg-gray-100 text-gray-400">
                    {candidate.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 absolute -top-1 -right-1 bg-white rounded-full shadow-sm border"
                  onClick={() => setSaved(!saved)}
                >
                  <Bookmark
                    className={cn(
                      "h-4 w-4",
                      saved ? "fill-blue-600 text-blue-600" : "text-gray-400"
                    )}
                  />
                </Button>
              </div>

              {/* Profile Summary */}
              <p className="text-sm text-gray-700 mt-3 line-clamp-2 max-w-[200px]">
                Seasoned professional with {candidate.profileSummary} years of experience. Expert in {candidate.keySkills[0]}...
              </p>

              {/* Actions */}
              <div className="flex flex-col w-full mt-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50 h-9"
                >
                  View phone number
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-700 border-gray-300 h-9 flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call candidate
                </Button>
                <div className="text-xs text-gray-500 mt-1">Verified phone & email</div>
              </div>

              {/* Bottom options */}
              <div className="flex items-center justify-center gap-3 text-xs text-blue-600 mt-4">
                <span className="cursor-pointer hover:underline">Comment</span>
                <span className="text-gray-300">|</span>
                <span className="cursor-pointer hover:underline">Save</span>
                <span className="text-gray-300">|</span>
                <span className="cursor-pointer hover:underline">Share</span>
              </div>
            </div>

          </div>
        </div>

      </CardContent>
    </Card>
  )
}


export default CandidateCard 
