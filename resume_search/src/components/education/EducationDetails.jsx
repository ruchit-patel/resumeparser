import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Switch } from '../ui/switch';

const EducationDetails = () => {
  const [ugQualification, setUgQualification] = useState('any');
  const [educationType, setEducationType] = useState('full-time');
  const [pgQualification, setPgQualification] = useState('any');

  return (
    <Card className="mb-6">
      <Accordion type="single" collapsible >
        <AccordionItem value="education">
          <AccordionTrigger className="px-6 py-4">
            <h2 className="text-xl font-semibold">Education Details</h2>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="space-y-4">
              {/* UG Qualification */}
              <div className="space-y-2">
                <Label className="block text-sm font-medium">UG Qualification</Label>
                <ToggleGroup type="single" value={ugQualification} onValueChange={(value) => value && setUgQualification(value)}>
                  <ToggleGroupItem value="any" variant="pill" size="pill">Any UG qualification</ToggleGroupItem>
                  <ToggleGroupItem value="specific" variant="pill" size="pill">Specific UG qualification</ToggleGroupItem>
                  <ToggleGroupItem value="none" variant="pill" size="pill">No UG qualification</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              {/* Choose Course */}
              <div className="space-y-2">
                <Label htmlFor="ug-course">Choose Course</Label>
                <Input 
                  id="ug-course"
                  placeholder="Type or select UG course from list" 
                />
              </div>
              
              {/* Institute */}
              <div className="space-y-2">
                <Label htmlFor="institute">Institute</Label>
                <Input 
                  id="institute"
                  placeholder="Select institute" 
                />
              </div>
              
              {/* Education Type */}
              <div className="space-y-2">
                <Label className="block text-sm font-medium">Education Type</Label>
                <ToggleGroup type="single" value={educationType} onValueChange={(value) => value && setEducationType(value)}>
                  <ToggleGroupItem value="full-time" variant="pill" size="pill">Full Time</ToggleGroupItem>
                  <ToggleGroupItem value="part-time" variant="pill" size="pill">Part Time</ToggleGroupItem>
                  <ToggleGroupItem value="correspondence" variant="pill" size="pill">Correspondence</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              {/* Year of degree completion */}
              <div className="space-y-2">
                <Label>Year of degree completion</Label>
                <div className="flex items-center space-x-2">
                  <select className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option>From</option>
                    {[...Array(30)].map((_, i) => (
                      <option key={i} value={2025 - i}>{2025 - i}</option>
                    ))}
                  </select>
                  <span className="text-gray-500">To</span>
                  <select className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option>To</option>
                    {[...Array(30)].map((_, i) => (
                      <option key={i} value={2025 - i}>{2025 - i}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* PG Qualification */}
              <div className="space-y-2">
                <Label className="block text-sm font-medium">PG Qualification</Label>
                <ToggleGroup type="single" value={pgQualification} onValueChange={(value) => value && setPgQualification(value)}>
                  <ToggleGroupItem value="any" variant="pill" size="pill">Any PG qualification</ToggleGroupItem>
                  <ToggleGroupItem value="specific" variant="pill" size="pill">Specific PG qualification</ToggleGroupItem>
                  <ToggleGroupItem value="none" variant="pill" size="pill">No PG qualification</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              {/* Add PPG/Doctorate Qualification */}
              <div>
                <Button variant="link" className="p-0 h-auto text-blue-600 text-sm font-medium flex items-center">
                  <span className="mr-1">+</span> Add PPG/Doctorate Qualification
                </Button>
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default EducationDetails;
