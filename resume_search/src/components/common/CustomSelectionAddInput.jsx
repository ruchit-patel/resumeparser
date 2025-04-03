import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import MultiAutoSuggations from './MultiAutoSuggationsComponent';

const CustomSelectionAddInput = ({ label, placeholder, List, setList }) => {
  const [skillSection, setSkillSection] = useState(false);

  return (
    <div className='space-y-2 w-1/3'>
      {!skillSection && (
        <Badge variant='outline' className='text-blue-800 cursor-pointer' onClick={() => setSkillSection(true)}>
          + Add {label}
        </Badge>
      )}
      {skillSection && (
        <div className="px-2 py-1 flex gap-2"> 
         <MultiAutoSuggations placeholder={placeholder} keywords={List} setKeywords={setList} setHideSection={setSkillSection}/>
         </div>
      )}
    </div>
  );
};

export default  CustomSelectionAddInput;