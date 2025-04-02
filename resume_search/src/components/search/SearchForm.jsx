import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import CutomInputSelection from '../common/customSelectionInput';
import SearchBar from './autoSearch';
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
  const [includeSalary, setIncludeSalary] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [searchIn, setSearchIn] = useState('Entire resume');

  const [skills, setSkills] = useState([]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-semibold">Search candidates</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Keywords */}
        <div className="space-y-2 flex flex-col">
          
          <Label htmlFor="keywords">Keywords</Label>
          <SearchBar/>
          {/* <Input 
            id="keywords"
            placeholder="Enter keywords like skills, designation, and company" 
            value={searchKeywords}
            onChange={(e) => setSearchKeywords(e.target.value)}/> */}

          {/* Find in Resume  */}
          <div className="mx-5 self-end flex gap-1">
              <label className="block text-sm font-medium item-center justify-center">
                Search keyword in {"   "}
              </label>
              <div className="flex items-center space-x-2">
                <Select value={searchIn} onValueChange={setSearchIn}>
                  <SelectTrigger className="border-none p-0 m-0 items-top h-auto !important">
                    <SelectValue placeholder="+" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border rounded-md shadow-lg mt-1">
                    <SelectItem value="Resume title">Resume title</SelectItem>
                    <SelectItem value="Resume title and keyskills">Resume title and keyskills</SelectItem>
                    <SelectItem value="Resume synopsis">Resume synopsis</SelectItem>
                    <SelectItem value="Entire resume">Entire resume</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          </div>
        </div>

        {/* Add IT Skills button */}

        <CutomInputSelection label='IT Skill' placeholder='Enter skill' List={skills} setList={setSkills} />

        {/* Experience */}
        <div className="space-y-2 flex flex-col">
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
        <div className="space-y-2 flex flex-col">
          <Label>Current location of candidate</Label>
          <Input 
            placeholder="Add location" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        {/* Annual Salary */}
        <div className="space-y-2 flex flex-col">
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
            <div className="flex items-center space-x-2 ">
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
      
      </CardContent>
    </Card>
  );
};

export default SearchForm;
