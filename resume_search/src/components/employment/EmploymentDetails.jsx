import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import CustomSelectionAddInput from '../common/CustomSelectionAddInput';
import DepartmentRoleSelector from './DepartmentSelection';
import AutocompleteInput from '../common/AutoCompleteInputComponent';

const EmploymentDetails = ({ formState, updateFormField }) => {
  // Destructure values from formState for convenience
  const {
    departmentes,
    industry,
    company,
    excludeCompanies,
    designation,
    noticePeriod
  } = formState;

  return (
    <Card className="mb-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="employment">
          <AccordionTrigger className="px-6 py-4">
            <h2 className="text-xl font-semibold">Employment Details</h2>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="space-y-4">
              {/* Department and Role */}
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="department-role">Department</Label>
                <DepartmentRoleSelector  selectedItems={departmentes} setSelectedItems={(value) => updateFormField('departmentes', value)}/>
              </div>
              
              {/* Industry */}
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="industry">Industry</Label>
                <AutocompleteInput 
                placeholder={"Add Industry"} 
                inputValue={industry} 
                setInputValue={(value) => updateFormField('industry', value)}
                apiEndPoint = {"api/method/resumeparser.apis.search_apis.seach_candidate_industry"}
                />
               
              </div>
              
              {/* Company */}
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="company">Company</Label>
                <AutocompleteInput 
                placeholder={"Add Company Name"} 
                inputValue={company} 
                setInputValue={(value) => updateFormField('company', value)}
                apiEndPoint = {"api/method/resumeparser.apis.search_apis.seach_candidate_company"}
                />

               
               <CustomSelectionAddInput 
                  label='Exclude Companies' 
                  placeholder='Enter Exclude Companies' 
                  List={excludeCompanies} 
                  setList={(value) => updateFormField('excludeCompanies', value)}
                  apiEndPoint = {"api/method/resumeparser.apis.search_apis.seach_candidate_company_exclude"}
                   />
              </div>
              
              {/* Designation */}
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="designation">Designation</Label>
                <AutocompleteInput 
                placeholder={"Add Designation"} 
                inputValue={designation} 
                setInputValue={(value) => updateFormField('designation', value)}
                apiEndPoint = {"api/method/resumeparser.apis.search_apis.seach_candidate_designation"}
                />

                          
              </div>
              
              {/* Notice Period / Availability to join */}
              <div className="space-y-2 flex flex-col">
                <Label>Notice Period / Availability to join</Label>
                <ToggleGroup type="single" value={noticePeriod} onValueChange={(value) => value && updateFormField('noticePeriod', value)}>
                  <ToggleGroupItem value="any" variant="pill" size="pill">Any</ToggleGroupItem>
                  <ToggleGroupItem value="15" variant="pill" size="pill">15 days</ToggleGroupItem>
                  <ToggleGroupItem value="30" variant="pill" size="pill">30 days</ToggleGroupItem>
                  <ToggleGroupItem value="60" variant="pill" size="pill">60 days</ToggleGroupItem>
                  <ToggleGroupItem value="90" variant="pill" size="pill">90 days</ToggleGroupItem>
                  <ToggleGroupItem value="120+" variant="pill" size="pill">More than 120 days</ToggleGroupItem>
                </ToggleGroup>
                
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default EmploymentDetails;
