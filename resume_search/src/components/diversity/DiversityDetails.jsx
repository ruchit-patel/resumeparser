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
import AutocompleteInput from '../common/AutoCompleteInputComponent';
const DiversityDetails = ({ formState, updateFormField }) => {
  // Destructure values from formState for convenience
  const {
    gender,
    category,
    candidateMinAge,
    candidateMaxAge,
    currentJobType,
    seekingJobType,
    verifiedFilters
  } = formState;

  const handleVerifiedFilterChange = (value) => {
    const newVerifiedFilters = verifiedFilters.includes(value)
      ? verifiedFilters.filter(item => item !== value)
      : [...verifiedFilters, value];
      
    updateFormField('verifiedFilters', newVerifiedFilters);
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
                  <ToggleGroup type="single" value={gender} onValueChange={(value) => value && updateFormField('gender', value)}>
                    <ToggleGroupItem value="all" variant="pill" size="pill">All candidates</ToggleGroupItem>
                    <ToggleGroupItem value="male" variant="pill" size="pill">Male</ToggleGroupItem>
                    <ToggleGroupItem value="female" variant="pill" size="pill">Female</ToggleGroupItem>
                    <ToggleGroupItem value="lgbtqiap" variant="pill" size="pill">LGBTQIA+</ToggleGroupItem>
                    <ToggleGroupItem value="veterans" variant="pill" size="pill">Veterans</ToggleGroupItem>
                    <ToggleGroupItem value="ews" variant="pill" size="pill">EWS</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                {/* Show only candidates who */}
                
                
                {/* Candidate Category */}
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="candidate-category">Candidate Category</Label>
                  <Select
                            value={category}
                            onValueChange={(value) => updateFormField('category', value)}
                          >
                            <SelectTrigger id="category" className="mt-1">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SC">SC</SelectItem>
                              <SelectItem value="ST">ST</SelectItem>
                              <SelectItem value="OBC">OBC</SelectItem>
                              <SelectItem value="General">General</SelectItem>
                            </SelectContent>
                          </Select>
                  
                </div>
                
                {/* Candidate Age */}
                <div className="space-y-2 flex flex-col">
                  <Label>Candidate Age</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      placeholder="Min age" 
                      className="w-1/3"
                      value={candidateMinAge}
                      onChange={(e) => updateFormField('candidateMinAge', e.target.value)}
                    />
                    <span className="text-gray-500">to</span>
                    <Input 
                      placeholder="Max age" 
                      className="w-1/3"
                      value={candidateMaxAge}
                      onChange={(e) => updateFormField('candidateMaxAge', e.target.value)}
                    />
                    <span className="text-gray-500">Years</span>
                  </div>
                </div>
              </div>
              
              {/* Work details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Work details</h3>
                
                {/* Show candidates seeking */}
                <div className="grid grid-cols-2 gap-4"> 
                  <div className="space-y-2 flex flex-col">
                    <Label>Current Job Type</Label>
                    <Select onValueChange={(value) => updateFormField('currentJobType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select current job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full Time">Full Time</SelectItem>
                        <SelectItem value="Part Time">Part Time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Temporary">Temporary</SelectItem>
                        <SelectItem value="Volunteer">Volunteer</SelectItem>
                        <SelectItem value="Intern">Intern</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <Label>Seeking Job Type</Label>
                    <Select onValueChange={(value) => updateFormField('seekingJobType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select desired job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full Time">Full Time</SelectItem>
                        <SelectItem value="Part Time">Part Time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Temporary">Temporary</SelectItem>
                        <SelectItem value="Volunteer">Volunteer</SelectItem>
                        <SelectItem value="Intern">Intern</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
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
