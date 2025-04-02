import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

const SearchForm = ({ 
  searchKeywords, 
  setSearchKeywords, 
  minExperience, 
  setMinExperience, 
  maxExperience, 
  setMaxExperience,
  location,
  setLocation
}) => {
  const [includeRelocate, setIncludeRelocate] = useState(false);
  const [excludeLocations, setExcludeLocations] = useState(false);
  const [includeSalary, setIncludeSalary] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-semibold">Search candidates</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Keywords */}
        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords</Label>
          <Input 
            id="keywords"
            placeholder="Enter keywords like skills, designation and company" 
            value={searchKeywords}
            onChange={(e) => setSearchKeywords(e.target.value)}
          />
        </div>
        
        {/* Experience */}
        <div className="space-y-2">
          <Label>Experience</Label>
          <div className="flex items-center space-x-2">
            <Input 
              placeholder="Min experience" 
              className="w-1/3"
              value={minExperience}
              onChange={(e) => setMinExperience(e.target.value)}
            />
            <span className="text-gray-500">to</span>
            <Input 
              placeholder="Max experience" 
              className="w-1/3"
              value={maxExperience}
              onChange={(e) => setMaxExperience(e.target.value)}
            />
            <span className="text-gray-500">Years</span>
          </div>
        </div>
        
        {/* Current location */}
        <div className="space-y-2">
          <Label>Current location of candidate</Label>
          <Input 
            placeholder="Add location" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          
          {/* Location checkboxes */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-candidates" 
                checked={includeRelocate}
                onCheckedChange={setIncludeRelocate}
              />
              <Label htmlFor="include-candidates" className="text-sm font-normal">
                Include candidates who prefer to relocate to above locations
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="exclude-candidates" 
                checked={excludeLocations}
                onCheckedChange={setExcludeLocations}
              />
              <Label htmlFor="exclude-candidates" className="text-sm font-normal">
                Exclude candidates who have mentioned these locations in...
              </Label>
            </div>
          </div>
        </div>
        
        {/* Annual Salary */}
        <div className="space-y-2">
          <Label>Annual Salary</Label>
          <div className="flex items-center space-x-2">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-1/4">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="Minimum" 
              className="w-1/4"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
            />
            <span className="text-gray-500">to</span>
            <Input 
              placeholder="Maximum" 
              className="w-1/4"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
            />
            <span className="text-gray-500">Lacs</span>
          </div>
          
          {/* Salary checkbox */}
          <div className="pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-salary" 
                checked={includeSalary}
                onCheckedChange={setIncludeSalary}
              />
              <Label htmlFor="include-salary" className="text-sm font-normal">
                Include candidates who did not mention their current salary
              </Label>
            </div>
          </div>
        </div>
        
        {/* Add IT Skills button */}
        <div>
          <Button variant="link" className="p-0 h-auto text-blue-600 text-sm font-medium flex items-center">
            <span className="mr-1">+</span> Add IT Skills
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
