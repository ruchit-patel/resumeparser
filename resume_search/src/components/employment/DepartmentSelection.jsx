import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { X, ChevronRight, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {config} from '@/config';

const fetchSearchData = async () => {
  try {
    const apiEndPoint = "api/method/resumeparser.apis.search_apis.candidate_departments"
    const response = await fetch(`${config.backendUrl}/${apiEndPoint}`);
    const result = await response.json();
    return result.message || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};

export default function DepartmentRoleSelector({ 
  placeholder = "Add Department/Role", 
  selectedItems,
  setSelectedItems
}) {
  // const [selectedItems, setSelectedItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedDept, setExpandedDept] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departments, setDepartments] = useState([]);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const loadDepartments = async () => {
      const data = await fetchSearchData();
      if (data && data.length > 0) {
        setDepartments(data);
      }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter departments and roles based on search query
  const filteredDepartments = departments.map(dept => {
    const filteredRoles = dept.roles.filter(role => 
      role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return {
      ...dept,
      roles: filteredRoles,
      matchesDept: dept.name.toLowerCase().includes(searchQuery.toLowerCase()),
      matchesRoles: filteredRoles.length > 0
    };
  }).filter(dept => searchQuery ? (dept.matchesDept || dept.matchesRoles) : true);

  // Auto-expand departments with matches when searching
  useEffect(() => {
    if (searchQuery) {
      filteredDepartments.forEach(dept => {
        if (dept.matchesDept || dept.matchesRoles) {
          setExpandedDept(dept.name);
        }
      });
    }
  }, [searchQuery]);

  const toggleDepartment = (deptName) => {
    setExpandedDept(expandedDept === deptName ? null : deptName);
  };

  const isRoleSelected = (deptName, role) => {
    return selectedItems.some(item => 
      item.department === deptName && item.role === role
    );
  };

  const isDepartmentSelected = (deptName) => {
    const departmentRoles = departments.find(d => d.name === deptName)?.roles || [];
    const selectedRolesInDept = selectedItems.filter(
      item => item.department === deptName && item.role
    ).length;
    
    return selectedRolesInDept === departmentRoles.length;
  };

  const toggleRole = (deptName, role) => {
    const fullString = role ? `${deptName} - ${role}` : deptName;
    
    if (isRoleSelected(deptName, role)) {
      setSelectedItems(prev => 
        prev.filter(item => !(item.department === deptName && item.role === role))
      );
    } else {
      setSelectedItems(prev => [
        ...prev, 
        { department: deptName, role, fullString }
      ]);
    }
  };

  const toggleSelectAllRoles = (deptName) => {
    const dept = departments.find(d => d.name === deptName);
    if (!dept) return;

    if (isDepartmentSelected(deptName)) {
      // Deselect all roles in this department
      setSelectedItems(prev => 
        prev.filter(item => item.department !== deptName)
      );
    } else {
      // Select all roles in this department
      const deptRoles = dept.roles.map(role => ({
        department: deptName,
        role,
        fullString: `${deptName} - ${role}`
      }));
      
      // Remove any existing roles from this department before adding all
      setSelectedItems(prev => [
        ...prev.filter(item => item.department !== deptName),
        ...deptRoles
      ]);
    }
  };

  const removeItem = (itemToRemove) => {
    setSelectedItems(prev => 
      prev.filter(item => item.fullString !== itemToRemove.fullString)
    );
  };

  const clearAll = () => setSelectedItems([]);

  const highlightMatches = (text) => {
    if (!searchQuery || !text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return text;
    }

    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === searchQuery.toLowerCase() ? 
            <span key={i} className="bg-yellow-200 font-medium">{part}</span> : 
            part
        )}
      </>
    );
  };

  return (
    <div className="w-full scroll-auto" ref={dropdownRef}>   
      <div className="border rounded-md p-2 bg-white min-h-10">
        <div className="flex flex-wrap gap-2 " onClick={() => setIsOpen(!isOpen)}>
          {selectedItems.map((item, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg flex items-center text-sm"
            >
              {item.fullString}
              <X 
                className="ml-1 cursor-pointer h-4 w-4" 
                onClick={() => removeItem(item)} 
              />
            </span>
          ))}
          {selectedItems.length === 0 && (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-1">
        {selectedItems.length > 0 && (
          <button onClick={clearAll} className="text-sm text-red-500">
            Clear all
          </button>
        )}
        <div className="flex-grow"></div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-blue-600 font-medium"
        >
          {isOpen ? "Close" : "Browse"}
        </button>
      </div>

      {isOpen && (
        <div className="z-10 bg-white border rounded-md mt-1 shadow-lg w-full max-h-[70vh] overflow-y-auto">
          <div className="sticky top-0 bg-gray-50 p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search departments or roles..." 
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {filteredDepartments.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No matches found for "{searchQuery}"
            </div>
          )}
          
          {filteredDepartments.map((dept, deptIndex) => (
            <div key={deptIndex} className="border-b last:border-0">
              <div 
                className={cn(
                  "flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50",
                  expandedDept === dept.name && "bg-gray-50",
                  dept.matchesDept && searchQuery && "bg-gray-100"
                )}
                onClick={() => toggleDepartment(dept.name)}
              >
                <ChevronRight 
                  className={cn(
                    "mr-2 h-4 w-4 transition-transform", 
                    expandedDept === dept.name && "transform rotate-90"
                  )} 
                />
                <div className="flex items-center flex-grow">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    checked={isDepartmentSelected(dept.name)}
                    onChange={() => toggleSelectAllRoles(dept.name)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="font-medium">
                    {highlightMatches(dept.name)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {selectedItems.filter(item => item.department === dept.name).length} / {dept.roles.length}
                  </span>
                </div>
              </div>
              
              {expandedDept === dept.name && (
                <div className="bg-gray-50 pl-10 pr-3 py-1">
                  <div 
                    className="pl-2 py-1 cursor-pointer hover:bg-gray-100 rounded flex items-center"
                    onClick={() => toggleSelectAllRoles(dept.name)}
                  >
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={isDepartmentSelected(dept.name)}
                      readOnly
                    />
                    <span className="text-gray-800">Any Roles</span>
                  </div>
                  
                  {dept.roles.map((role, roleIndex) => (
                    <div 
                      key={roleIndex} 
                      className={cn(
                        "pl-2 py-1 cursor-pointer hover:bg-gray-100 rounded flex items-center",
                        searchQuery && role.toLowerCase().includes(searchQuery.toLowerCase()) && "bg-gray-100"
                      )}
                      onClick={() => toggleRole(dept.name, role)}
                    >
                      <div className="w-5 h-5 flex items-center justify-center mr-2 border rounded">
                        {isRoleSelected(dept.name, role) && <Check className="h-4 w-4 text-blue-600" />}
                      </div>
                      <span>{highlightMatches(role)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}