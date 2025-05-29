import React, { useState } from 'react';
import { Label } from '../ui/label';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { AlertCircle } from 'lucide-react';
import AutocompleteInput from '../common/AutoCompleteInputComponent';
import CourceSelector from './CourceSelection';

const EducationQualification = ({ ugQualification,

    course, setCourse,
    institute, setInstitute,
    educationType, setEducationType,
    fromYear, setFromYear,
    toYear, setToYear,

 }) => {


    const generateYearOptions = (startYear) => {
        const currentYear = 2025;
        const years = [];
        for (let i = currentYear; i >= 1995; i--) {
            if (!startYear || i >= startYear) {
                years.push(i);
            }
        }
        return years;
    };


    return (
        <div>
            {ugQualification === 'specific' && (
                <>
                    <div id="chooseCourse" className="space-y-2 flex flex-col">
                        <Label htmlFor="ug-course">Choose Course</Label>
                        <CourceSelector placeholder='Type or Select UG course from list' setSelectedItems={setCourse} selectedItems={course} />
                    </div>
                    <div id="institute" className="space-y-2 flex flex-col">
                        <Label htmlFor="institute">Institute</Label>
                        <AutocompleteInput
                            placeholder={"Select institute"}
                            setInputValue={setInstitute}
                            inputValue={institute}
                            apiEndPoint={"api/method/resumeparser.apis.search_apis.seach_candidate_edu_institute"}
                        />
                    </div>
                </>
            )}

            {ugQualification === 'none' && (
                <div className="flex items-center text-red-600 h-20">
                    <AlertCircle className="mr-2" />
                    No UG qualification required.
                </div>
            )}

            {ugQualification === 'any' && (
                 <div id="chooseCourse" className="space-y-2 flex flex-col">
                 <Label htmlFor="ug-course">Choose Course</Label>
                 <CourceSelector placeholder='Type or Select UG course from list' setSelectedItems={setCourse} selectedItems={course} />
             </div>
            )}

            {ugQualification !== '' && (
                <div className="space-y-2 hidden flex-col">
                    <Label className="block text-sm font-medium pt-1">Education Type</Label>
                    <ToggleGroup type="single" className='flex gap-2 pb-3' value={educationType} onValueChange={(value) => value && setEducationType(value)}>
                        <ToggleGroupItem value="full-time" variant="pill" size="pill">Full Time</ToggleGroupItem>
                        <ToggleGroupItem value="part-time" variant="pill" size="pill">Part Time</ToggleGroupItem>
                        <ToggleGroupItem value="correspondence" variant="pill" size="pill">Correspondence</ToggleGroupItem>
                    </ToggleGroup>
                </div>
            )}

            {ugQualification !== '' && (
                <div className="space-y-2 flex flex-col">
                    <Label>Year of degree completion</Label>
                    <div className="flex items-center space-x-2">
                        <select value={fromYear} onChange={(e) => setFromYear(e.target.value)} className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none">
                            <option>From</option>
                            {generateYearOptions().map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <span className="text-gray-500">To</span>
                        <select value={toYear} onChange={(e) => setToYear(e.target.value)} className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none">
                            <option>To</option>
                            {generateYearOptions(fromYear).map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EducationQualification;
