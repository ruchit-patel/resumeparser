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
import EducationQualification from './UGPGQualification';
const EducationDetails = (
  {
    ugQualification, setUgQualification,
    pgQualification, setPgQualification,
    
    ugcourse, ugsetCourse,
    uginstitute, ugsetInstitute,
    ugeducationType, ugsetEducationType,
    ugfromYear, ugsetFromYear,
    ugtoYear, ugsetToYear,

    pgcourse, pgsetCourse,
    pginstitute, pgsetInstitute,
    pgeducationType, pgsetEducationType,
    pgfromYear, pgsetFromYear,
    pgtoYear, pgsetToYear,


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

              <EducationQualification ugQualification={ugQualification}
                  course={ugcourse}
                  setCourse={ugsetCourse}
                  institute={uginstitute}
                  setInstitute={ugsetInstitute}
                  educationType={ugeducationType}
                  setEducationType={ugsetEducationType}
                  fromYear={ugfromYear}
                  setFromYear={ugsetFromYear}
                  toYear={ugtoYear}
                  setToYear={ugsetToYear}
              
              />
              
              {/* PG Qualification */}
              <div className="space-y-2 flex flex-col">
                <Label className="block text-sm font-medium">PG Qualification</Label>
                <ToggleGroup type="single" value={pgQualification} onValueChange={(value) => value && setPgQualification(value)}>
                  <ToggleGroupItem value="any" variant="pill" size="pill">Any PG qualification</ToggleGroupItem>
                  <ToggleGroupItem value="specific" variant="pill" size="pill">Specific PG qualification</ToggleGroupItem>
                  <ToggleGroupItem value="none" variant="pill" size="pill">No PG qualification</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <EducationQualification ugQualification={pgQualification}
                  course={pgcourse}
                  setCourse={pgsetCourse}
                  institute={pginstitute}
                  setInstitute={pgsetInstitute}
                  educationType={pgeducationType}
                  setEducationType={pgsetEducationType}
                  fromYear={pgfromYear}
                  setFromYear={pgsetFromYear}
                  toYear={pgtoYear}
                  setToYear={pgsetToYear}/>

              {/* Add PPG/Doctorate Qualification */}
              
              <div>
                <CustomSelectionAddInput 
                label={"PPG Doctorate Qualification"} 
                placeholder={"Enter Qualification"} 
                setList={setdoctorateQualification} 
                List={doctorateQualification}
                apiEndPoint = {"api/method/resumeparser.apis.search_apis.seach_certificates"}
                />
              </div>
              
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default EducationDetails;
