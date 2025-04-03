import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import CustomSelectionAddInput from '../common/CustomSelectionAddInput';
import DepartmentRoleSelector from './DepartmentSelection';
import AutocompleteInput from '../common/AutoCompleteInputComponent';

const EmploymentDetails = ({
  departmentes,setDepartmentes,
  industry,setIndustry,
  company,setCompany,
  excludeCompanies,setExcludeCompanies,
  designation,setDesignation,
  noticePeriod,setNoticePeriod
}) => {
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
                <Label htmlFor="department-role">Department and Role</Label>
                <DepartmentRoleSelector  selectedItems={departmentes} setSelectedItems={setDepartmentes}/>
              </div>
              
              {/* Industry */}
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="industry">Industry</Label>
                <AutocompleteInput placeholder={"Add Industry"} inputValue={industry} setInputValue={setIndustry}/>
               
              </div>
              
              {/* Company */}
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="company">Company</Label>
                <AutocompleteInput placeholder={"Add Company Name"} inputValue={company} setInputValue={setCompany}/>

               
               <CustomSelectionAddInput 
                  label='Exclude Companies' 
                  placeholder='Enter Exclude Companies' 
                  List={excludeCompanies} 
                  setList={setExcludeCompanies} />
              </div>
              
              {/* Designation */}
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="designation">Designation</Label>
                <AutocompleteInput placeholder={"Add Designation"} inputValue={designation} setInputValue={setDesignation}/>

                          
              </div>
              
              {/* Notice Period / Availability to join */}
              <div className="space-y-2 flex flex-col">
                <Label>Notice Period / Availability to join</Label>
                <ToggleGroup type="single" value={noticePeriod} onValueChange={(value) => value && setNoticePeriod(value)}>
                  <ToggleGroupItem value="any" variant="pill" size="pill">Any</ToggleGroupItem>
                  <ToggleGroupItem value="0-15" variant="pill" size="pill">0-15 days +</ToggleGroupItem>
                  <ToggleGroupItem value="1-month" variant="pill" size="pill">1 month +</ToggleGroupItem>
                  <ToggleGroupItem value="2-months" variant="pill" size="pill">2 months +</ToggleGroupItem>
                  <ToggleGroupItem value="3-months" variant="pill" size="pill">3 months +</ToggleGroupItem>
                  <ToggleGroupItem value="more-than-3" variant="pill" size="pill">More than 3 months +</ToggleGroupItem>
                  <ToggleGroupItem value="more-than-3" variant="pill" size="pill">Current Serving notice period +</ToggleGroupItem>
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
