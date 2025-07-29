import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const MultiLocationInput = ({ 
  placeholder = "Add locations", 
  selectedLocations = [], 
  setSelectedLocations,
  apiEndpoint 
}) => {
  // Ensure selectedLocations is always an array
  const safeSelectedLocations = Array.isArray(selectedLocations) ? selectedLocations : [];
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const fetchSuggestions = async (query) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(`/${apiEndpoint}?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.message && Array.isArray(data.message)) {
        setSuggestions(data.message);
        setShowSuggestions(data.message.length > 0);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (inputValue.trim().length >= 2) {
      fetchSuggestions(inputValue);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addLocation = (location) => {
    console.log('Adding location:', location);
    console.log('Current selectedLocations:', selectedLocations);
    console.log('Location type:', typeof location);
    console.log('SelectedLocations type:', typeof selectedLocations);
    
    if (location && location.trim() && !safeSelectedLocations.includes(location)) {
      const newLocations = [...safeSelectedLocations, location];
      console.log('New locations after add:', newLocations);
      setSelectedLocations(newLocations);
      setInputValue('');
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else {
      console.log('Location not added - already exists or invalid');
    }
  };

  const removeLocation = (locationToRemove) => {
    console.log('Removing location:', locationToRemove);
    console.log('Current locations:', safeSelectedLocations);
    const newLocations = safeSelectedLocations.filter(loc => loc !== locationToRemove);
    console.log('New locations:', newLocations);
    setSelectedLocations(newLocations);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      addLocation(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  // Debug: Log when component renders
  console.log('MultiLocationInput render - safeSelectedLocations:', safeSelectedLocations);

  return (
    <div className="w-full">
      {/* Debug info */}
      <div className="text-xs text-gray-500 mb-1">
        Current locations: {safeSelectedLocations.length} | Input: "{inputValue}"
      </div>
      
      {/* Selected locations display */}
      {safeSelectedLocations.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {safeSelectedLocations.map((location, index) => (
            <Badge 
              key={index}
              variant="secondary" 
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeLocation(location);
              }}
            >
              {location}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-600" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeLocation(location);
                }}
              />
            </Badge>
          ))}
        </div>
      )}
      
      {/* Input field */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full"
        />
        
        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={cn(
                  "px-4 py-2 cursor-pointer border-b last:border-b-0",
                  index === selectedIndex
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-100"
                )}
                onClick={() => addLocation(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiLocationInput;