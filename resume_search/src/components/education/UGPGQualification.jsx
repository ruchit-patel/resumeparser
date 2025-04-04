import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { AlertCircle } from 'lucide-react';
import AutocompleteInput from '../common/AutoCompleteInputComponent';
import CourceSelector from './CourceSelection';

const EducationQualification = ({ ugQualification }) => {
  const [course, setCourse] = useState('');
  const [institute, setInstitute] = useState('');
  const [educationType, setEducationType] = useState('');
  const [fromYear, setFromYear] = useState('');
  const [toYear, setToYear] = useState('');

  return (
    <div className="space-y-4">
        hi {ugQualification}
            
    </div>
  );
};

export default EducationQualification;
