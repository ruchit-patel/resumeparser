import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Switch } from '../ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Checkbox } from '../ui/checkbox';

const EmploymentDetails = () => {
  const [noticePeriod, setNoticePeriod] = useState('any');
  const [boostCompany, setBoostCompany] = useState(false);
  const [boostDesignation, setBoostDesignation] = useState(false);
  const [searchCurrentCompany, setSearchCurrentCompany] = useState(false);
  const [searchCurrentDesignation, setSearchCurrentDesignation] = useState(false);
  const [servingNoticePeriod, setServingNoticePeriod] = useState(false);

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
              <div className="space-y-2">
                <Label htmlFor="department-role">Department and Role</Label>
                <Input 
                  id="department-role"
                  placeholder="Add Department and Role" 
                />
              </div>
              
              {/* Industry */}
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input 
                  id="industry"
                  placeholder="Add Industry" 
                />
              </div>
              
              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company"
                  placeholder="Add Company name" 
                />
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Boosted off</span>
                  <Switch 
                    checked={boostCompany}
                    onCheckedChange={setBoostCompany}
                  />
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="search-current-company" 
                      checked={searchCurrentCompany}
                      onCheckedChange={setSearchCurrentCompany}
                    />
                    <Label htmlFor="search-current-company" className="font-normal">
                      Search in Current company
                    </Label>
                  </div>
                </div>
              </div>
              
              {/* Designation */}
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input 
                  id="designation"
                  placeholder="Add designation" 
                />
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Boosted off</span>
                  <Switch 
                    checked={boostDesignation}
                    onCheckedChange={setBoostDesignation}
                  />
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="search-current-designation" 
                      checked={searchCurrentDesignation}
                      onCheckedChange={setSearchCurrentDesignation}
                    />
                    <Label htmlFor="search-current-designation" className="font-normal">
                      Search in Current designation
                    </Label>
                  </div>
                </div>
              </div>
              
              {/* Notice Period / Availability to join */}
              <div className="space-y-2">
                <Label>Notice Period / Availability to join</Label>
                <ToggleGroup type="single" value={noticePeriod} onValueChange={(value) => value && setNoticePeriod(value)}>
                  <ToggleGroupItem value="any" variant="pill" size="pill">Any</ToggleGroupItem>
                  <ToggleGroupItem value="0-15" variant="pill" size="pill">0-15 days</ToggleGroupItem>
                  <ToggleGroupItem value="1-month" variant="pill" size="pill">1 month</ToggleGroupItem>
                  <ToggleGroupItem value="2-months" variant="pill" size="pill">2 months</ToggleGroupItem>
                  <ToggleGroupItem value="3-months" variant="pill" size="pill">3 months</ToggleGroupItem>
                  <ToggleGroupItem value="more-than-3" variant="pill" size="pill">More than 3 months</ToggleGroupItem>
                </ToggleGroup>
                
                <div className="mt-3 flex items-center space-x-2">
                  <Checkbox 
                    id="serving-notice-period" 
                    checked={servingNoticePeriod}
                    onCheckedChange={setServingNoticePeriod}
                  />
                  <Label htmlFor="serving-notice-period" className="font-normal">
                    Currently serving notice period
                  </Label>
                </div>
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default EmploymentDetails;
