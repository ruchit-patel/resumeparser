import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import AutocompleteInput from '../common/AutoCompleteInputComponent';
import CourceSelector from './CourceSelection';
import CustomSelectionAddInput from '../common/CustomSelectionAddInput';
const EducationDetails = (
  {
    ugQualification, setUgQualification,
    course, setCourse,
    institute, setInstitute,
    educationType, setEducationType,
    fromYear, setFromYear,
    toYear, setToYear,
    pgQualification, setPgQualification,
    doctorateQualification, setdoctorateQualification,
  }
) => {


  return (
    <Card className="mb-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="education">
          <AccordionTrigger className="px-6 py-4">
            <h2 className="text-xl font-semibold">Education Details</h2>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="space-y-4">
              {/* UG Qualification */}
              <div className="space-y-2 flex flex-col">
                <Label className="block text-sm font-medium">UG Qualification</Label>
                <ToggleGroup type="single" value={ugQualification} onValueChange={(value) => value && setUgQualification(value)}>
                  <ToggleGroupItem value="any" variant="pill" size="pill">Any UG qualification</ToggleGroupItem>
                  <ToggleGroupItem value="specific" variant="pill" size="pill">Specific UG qualification</ToggleGroupItem>
                  <ToggleGroupItem value="none" variant="pill" size="pill">No UG qualification</ToggleGroupItem>
                </ToggleGroup>
              </div>

              {ugQualification === 'specific' && (
                <>
                  <div id="chooseCourse" className="space-y-2 flex flex-col">
                    <Label htmlFor="ug-course">Choose Course</Label>
                    {/* <AutocompleteInput
                     placeholder={"Type or select UG course from list"}
                     setInputValue={setCourse}
                     inputValue={course}
                     /> */}

                     <CourceSelector placeholder='Type or Select UG cource from list' setSelectedItems={setCourse} selectedItems={course}/>

                  </div>
                  <div id="institute" className="space-y-2 flex flex-col">
                    <Label htmlFor="institute">Institute</Label>
                    <AutocompleteInput
                     placeholder={"Select institute"}
                     setInputValue={setInstitute}
                     inputValue={institute}
                     />
    
                  </div>
                </>
              )}

              {ugQualification === 'none' && (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="mr-2" />
                  No UG qualification required.
                </div>
              )}

                            
              {/* Education Type */}
              <div className="space-y-2 flex flex-col">
                <Label className="block text-sm font-medium">Education Type</Label>
                <ToggleGroup type="single" value={educationType} onValueChange={(value) => value && setEducationType(value)}>
                  <ToggleGroupItem value="full-time" variant="pill" size="pill">Full Time</ToggleGroupItem>
                  <ToggleGroupItem value="part-time" variant="pill" size="pill">Part Time</ToggleGroupItem>
                  <ToggleGroupItem value="correspondence" variant="pill" size="pill">Correspondence</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              {/* Year of degree completion */}
              <div className="space-y-2 flex flex-col">
                <Label>Year of degree completion</Label>
                <div className="flex items-center space-x-2">
                  <select value={fromYear} onChange={(e) => setFromYear(e.target.value)} className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none">
                    <option>From</option>
                    {[...Array(30)].map((_, i) => (
                      <option key={i} value={2025 - i}>{2025 - i}</option>
                    ))}
                  </select>
                  <span className="text-gray-500">To</span>
                  <select value={toYear} onChange={(e) => setToYear(e.target.value)} className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none">
                    <option>To</option>
                    {[...Array(30)].map((_, i) => (
                      <option key={i} value={2025 - i}>{2025 - i}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* PG Qualification */}
              <div className="space-y-2 flex flex-col">
                <Label className="block text-sm font-medium">PG Qualification</Label>
                <ToggleGroup type="single" value={pgQualification} onValueChange={(value) => value && setPgQualification(value)}>
                  <ToggleGroupItem value="any" variant="pill" size="pill">Any PG qualification</ToggleGroupItem>
                  <ToggleGroupItem value="specific" variant="pill" size="pill">Specific PG qualification</ToggleGroupItem>
                  <ToggleGroupItem value="none" variant="pill" size="pill">No PG qualification</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              {/* Add PPG/Doctorate Qualification */}
              <div>
                <CustomSelectionAddInput label={"PPG Doctorate Qualification"} placeholder={"Enter Qualification"} setList={setdoctorateQualification} List={doctorateQualification}/>
              </div>
              
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default EducationDetails;
