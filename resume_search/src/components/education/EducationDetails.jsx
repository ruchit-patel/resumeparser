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
const EducationDetails = ({ formState, updateFormField }) => {
  // Destructure values from formState for convenience
  const {
    ugQualification,
    pgQualification,
    ugcourse,
    uginstitute,
    ugeducationType,
    ugfromYear,
    ugtoYear,
    pgcourse,
    pginstitute,
    pgeducationType,
    pgfromYear,
    pgtoYear,
    doctorateQualification
  } = formState;


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
                <ToggleGroup type="single" value={ugQualification} onValueChange={(value) => value && updateFormField('ugQualification', value)}>
                  <ToggleGroupItem value="any" variant="pill" size="pill">Any UG qualification</ToggleGroupItem>
                  <ToggleGroupItem value="specific" variant="pill" size="pill">Specific UG qualification</ToggleGroupItem>
                  <ToggleGroupItem value="none" variant="pill" size="pill">No UG qualification</ToggleGroupItem>
                </ToggleGroup>
              </div>

              <EducationQualification ugQualification={ugQualification}
                  course={ugcourse}
                  setCourse={(value) => updateFormField('ugcourse', value)}
                  institute={uginstitute}
                  setInstitute={(value) => updateFormField('uginstitute', value)}
                  educationType={ugeducationType}
                  setEducationType={(value) => updateFormField('ugeducationType', value)}
                  fromYear={ugfromYear}
                  setFromYear={(value) => updateFormField('ugfromYear', value)}
                  toYear={ugtoYear}
                  setToYear={(value) => updateFormField('ugtoYear', value)}
              />
              
              {/* PG Qualification */}
              <div className="space-y-2 flex flex-col">
                <Label className="block text-sm font-medium">PG Qualification</Label>
                <ToggleGroup type="single" value={pgQualification} onValueChange={(value) => value && updateFormField('pgQualification', value)}>
                  <ToggleGroupItem value="any" variant="pill" size="pill">Any PG qualification</ToggleGroupItem>
                  <ToggleGroupItem value="specific" variant="pill" size="pill">Specific PG qualification</ToggleGroupItem>
                  <ToggleGroupItem value="none" variant="pill" size="pill">No PG qualification</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <EducationQualification ugQualification={pgQualification}
                  course={pgcourse}
                  setCourse={(value) => updateFormField('pgcourse', value)}
                  institute={pginstitute}
                  setInstitute={(value) => updateFormField('pginstitute', value)}
                  educationType={pgeducationType}
                  setEducationType={(value) => updateFormField('pgeducationType', value)}
                  fromYear={pgfromYear}
                  setFromYear={(value) => updateFormField('pgfromYear', value)}
                  toYear={pgtoYear}
                  setToYear={(value) => updateFormField('pgtoYear', value)}/>

              {/* Add PPG/Doctorate Qualification */}
              
              <div>
                <CustomSelectionAddInput 
                label={"PPG Doctorate Qualification"} 
                placeholder={"Enter Qualification"} 
                setList={(value) => updateFormField('doctorateQualification', value)} 
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
