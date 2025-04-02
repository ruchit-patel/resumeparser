import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const CutomInputSelection = ({ label, placeholder, List, setList }) => {
  const [newSkill, setNewSkill] = useState('');
  const [skillSection, setSkillSection] = useState(false);

  const addSkill = () => {
    if (newSkill.trim()) {
      setList([...List, newSkill]);
      setNewSkill('');
      setSkillSection(true);
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = List.filter((_, i) => i !== index);
    setList(updatedSkills);
    if (updatedSkills.length === 0) {
      setSkillSection(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSkill();
    }
  };

  return (
    <div className='space-y-2 max-w-screen'>
      {!skillSection && (
        <Badge variant='outline' className='text-blue-800 cursor-pointer' onClick={() => setSkillSection(true)}>
          + Add {label}
        </Badge>
      )}
      {skillSection && (
        <div className='space-y-2 flex flex-wrap gap-2 items-center'>
          {List.map((skill, index) => (
            <div key={index} className='p-2 bg-gray-100 rounded-md flex items-center gap-1'>
              {skill}
              <X className='cursor-pointer text-red-500' size={16} onClick={() => removeSkill(index)} />
            </div>
          ))}
          <Input
            placeholder={placeholder}
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyPress}
            className='w-auto'
          />
        </div>
      )}
    </div>
  );
};

export default  CutomInputSelection;