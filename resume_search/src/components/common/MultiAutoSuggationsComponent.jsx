"use client"

import { useState, useRef, useEffect } from "react"
import { X, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { config } from "@/config"

const MultiAutoSuggations = ({placeholder, keywords, setKeywords, setHideSection, apiEndPoint}) => {
  // const [keywords, setKeywords] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const debounceTimeoutRef = useRef(null)

  const fetchSearchData = async (query) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Cookie", "full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_lang=en");
  
      setIsLoading(true)
      const response = await fetch(`${config.backendUrl}/${apiEndPoint}?q=${query}`);
      const result = await response.json();
      setIsLoading(false)
      return result;
    } catch (error) {
      console.error(error);
      setIsLoading(false)
      return null;
    }
  }; 

  // Debounced input handler
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // If input is empty, clear suggestions immediately
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    // Set a new timeout - only call API when user pauses typing (500ms)
    debounceTimeoutRef.current = setTimeout(() => {
      fetchSearchData(value).then((response) => {
        if (response && response.message) {
          const filtered = response.message;
          setSuggestions(filtered);
          setShowSuggestions(filtered.length > 0);
        }
      });
    }, 500); // 500ms debounce time - adjust as needed
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Remove the direct effect that watches inputValue changes
  // We now handle this in the debounced input handler

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const addKeyword = (text, cat) => {
    if (text.trim() && !keywords.some((k) => k.text.toLowerCase() === text.toLowerCase())) {
      setKeywords([...keywords, { text, cat, isNecessary: false }])
      setInputValue("")
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  const removeKeyword = (index) => {
    const newKeywords = [...keywords]
    newKeywords.splice(index, 1)
    setKeywords(newKeywords)
    if (newKeywords.length === 0) {
      setHideSection(false);
    }
  }

  const toggleNecessary = (index) => {
    const newKeywords = [...keywords]
    newKeywords[index].isNecessary = !newKeywords[index].isNecessary
    setKeywords(newKeywords)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
        addKeyword(suggestions[selectedSuggestionIndex][0], suggestions[selectedSuggestionIndex][1])
      } else {
        addKeyword(inputValue)
      }
    } else if (e.key === "ArrowDown" && showSuggestions) {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp" && showSuggestions) {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0))
    }
  }

  return (
    <div className="w-full flex flex-col gap-2">
        {/* List of Skills */}
        { keywords.length > 0 && (
           <div className="flex flex-wrap gap-1">
           {keywords.map((keyword, index) => (
             <div key={index} className="flex items-center gap-1 bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-sm">
               <button onClick={() => toggleNecessary(index)} className="focus:outline-none">
                 <Star className={cn("h-4 w-4", keyword.isNecessary ? "fill-blue-500 text-blue-500" : "text-blue-300")} />
               </button>
               <span>{keyword.text}</span>
               <button onClick={() => removeKeyword(index)} className="focus:outline-none hover:bg-blue-100 rounded-full">
                 <X className="h-4 w-4 text-blue-500" />
               </button>
             </div>
           ))}
         </div>
        )}
       
        {/* Enter new Skill */}
        <div className="relative w-auto">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-8"
          />
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute right-2 top-1">
              <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

        {/* Suggestions List */}
          {showSuggestions && (
            <div ref={suggestionsRef} className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              <ul className="py-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className={cn("px-3 py-1.5 cursor-pointer text-sm", index === selectedSuggestionIndex ? "bg-blue-50" : "hover:bg-gray-50")} onClick={() => addKeyword(suggestion[0], suggestion[1])}>
                    {suggestion[0]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
    </div>
  )
}

export default MultiAutoSuggations;