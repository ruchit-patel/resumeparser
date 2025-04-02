import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Toggle } from '../ui/toggle';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Checkbox } from '../ui/checkbox';

const DiversityDetails = () => {
  const [gender, setGender] = useState('all');
  const [showCandidates, setShowCandidates] = useState('all');
  const [verifiedFilters, setVerifiedFilters] = useState([]);
  const [showDiversityOptions, setShowDiversityOptions] = useState(false);

  const handleVerifiedFilterChange = (value) => {
    setVerifiedFilters(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  return (
    <Card className="mb-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="diversity">
          <AccordionTrigger className="px-6 py-4">
            <h2 className="text-xl font-semibold">Diversity and Additional Details</h2>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Diversity details</h3>
                
                {/* Gender */}
                <div className="space-y-2 flex flex-col">
                  <Label>Gender</Label>
                  <ToggleGroup type="single" value={gender} onValueChange={(value) => value && setGender(value)}>
                    <ToggleGroupItem value="all" variant="pill" size="pill">All candidates</ToggleGroupItem>
                    <ToggleGroupItem value="male" variant="pill" size="pill">Male candidates</ToggleGroupItem>
                    <ToggleGroupItem value="female" variant="pill" size="pill">Female candidates</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                {/* Show only candidates who */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="diversity-checkbox" 
                    checked={showDiversityOptions}
                    onCheckedChange={setShowDiversityOptions}
                  />
                  <Label htmlFor="diversity-checkbox" className="font-normal">
                    Show only candidates who
                  </Label>
                </div>
                
                {/* Candidate Category */}
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="candidate-category">Candidate Category</Label>
                  <Input 
                    id="candidate-category"
                    placeholder="Add candidate category" 
                  />
                </div>
                
                {/* Candidate Age */}
                <div className="space-y-2 flex flex-col">
                  <Label>Candidate Age</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      placeholder="Min age" 
                      className="w-1/3"
                    />
                    <span className="text-gray-500">to</span>
                    <Input 
                      placeholder="Max age" 
                      className="w-1/3"
                    />
                    <span className="text-gray-500">Years</span>
                  </div>
                </div>
              </div>
              
              {/* Work details */}
              <div className="space-y-4  flex flex-col">
                <h3 className="text-sm font-medium text-gray-700">Work details</h3>
                
                {/* Show candidates seeking */}
                <div className="space-y-2 flex flex-col">
                  <Label>Show candidates seeking</Label>
                  <div className="flex space-x-2">
                    <Select>
                      <SelectTrigger className="w-1/3">
                        <SelectValue placeholder="Job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-1/3">
                        <SelectValue placeholder="Employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Work permit for */}
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="work-permit">Work permit for</Label>
                  <Input 
                    id="work-permit"
                    placeholder="Choose category" 
                  />
                </div>
              </div>
              
              {/* Display details */}
              <div className="space-y-4 flex flex-col">
                <h3 className="text-sm font-medium text-gray-700">Display details</h3>
                
                {/* Show */}
                <div className="space-y-2 flex flex-col">
                  <Label>Show</Label>
                  <ToggleGroup type="single" value={showCandidates} onValueChange={(value) => value && setShowCandidates(value)}>
                    <ToggleGroupItem value="all" variant="pill" size="pill">All candidates</ToggleGroupItem>
                    <ToggleGroupItem value="new" variant="pill" size="pill">New registrations</ToggleGroupItem>
                    <ToggleGroupItem value="modified" variant="pill" size="pill">Modified candidates</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                {/* Show only candidates with */}
                <div className="space-y-2 flex flex-col">
                  <Label>Show only candidates with</Label>
                  <div className="flex flex-wrap gap-2">
                    <Toggle 
                      variant="pill" 
                      size="pill" 
                      pressed={verifiedFilters.includes('mobile')}
                      onPressedChange={() => handleVerifiedFilterChange('mobile')}
                    >
                      Verified mobile number
                    </Toggle>
                    <Toggle 
                      variant="pill" 
                      size="pill" 
                      pressed={verifiedFilters.includes('email')}
                      onPressedChange={() => handleVerifiedFilterChange('email')}
                    >
                      Verified email ID
                    </Toggle>
                    <Toggle 
                      variant="pill" 
                      size="pill" 
                      pressed={verifiedFilters.includes('resume')}
                      onPressedChange={() => handleVerifiedFilterChange('resume')}
                    >
                      Attached resume
                    </Toggle>
                  </div>
                </div>
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default DiversityDetails;
