import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import CustomSelectionAddInput from '../common/CustomSelectionAddInput';
import DepartmentRoleSelector from './DepartmentSelection';
import AutocompleteInput from '../common/AutoCompleteInputComponent';
import { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem } from '../ui/select';

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

  // State for industry options
  const [industryOptions, setIndustryOptions] = useState([]);

  useEffect(() => {
    // Fetch industry options from API
    fetch('/api/method/resumeparser.apis.search_apis.seach_candidate_industry')
      .then(res => res.json())
      .then(data => {
        // Adjust this according to your API response structure
        if (data && data.message) {
          setIndustryOptions(data.message);
        }
      });
  }, []);

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
            <div className="space-y-2 flex flex-col w-full">
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={industry || ''}
                onValueChange={(value) => updateFormField('industry', value)}
              >
                <SelectTrigger className="w-full"> {/* Full width trigger */}
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent className="w-full max-h-60 overflow-y-auto">
                  <SelectGroup>
                    <SelectLabel>Industries</SelectLabel>
                    {industryOptions.map((option, idx) => (
                      <SelectItem
                        key={option.value || option.name || idx}
                        value={option.value || option.name || option}
                      >
                        {option.label || option.name || option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
