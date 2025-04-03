"use client"

import { useState, useRef, useEffect } from "react"
import { X, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const MultiAutoSuggations = ({placeholder,keywords,setKeywords,setHideSection}) => {
  // const [keywords, setKeywords] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)




  const fetchSearchData = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Cookie", "connect.sid=s%3ARudFLEowBmEoJFYaY5ALLvqm3J67MSdH.2uDZBnIpaEuiWVkZfRYLExdJOszjPtNzEV2lwAJbZz8");
  
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };
  
      const response = await fetch("https://api.freeapi.app/api/v1/public/randomproducts?page=1&limit=5&query=mens-watches", requestOptions);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }; 


  const allSuggestions = [
    "JavaScript", "TypeScript", "React", "Vue", "Angular", "Node.js", "Python", "Django", "Flask", "Ruby", "Rails", "PHP", "Laravel", "Java", "Spring", "C#", ".NET", "Go", "Rust", "Swift",
  ]

  useEffect(() => {
    if (inputValue.trim()) {
      fetchSearchData().then((response) => {
        console.log(response.data.data); // Use the returned JSON data here
      });
      const filtered = allSuggestions.filter((item) => item.toLowerCase().includes(inputValue.toLowerCase()))
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [inputValue])

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

  const addKeyword = (text) => {
    if (text.trim() && !keywords.some((k) => k.text.toLowerCase() === text.toLowerCase())) {
      setKeywords([...keywords, { text, isNecessary: false }])
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
        addKeyword(suggestions[selectedSuggestionIndex])
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
    <div className="w-full flex flex-col gap-1">
        {/* List of Skills */}
        <div className="relative flex flex-wrap gap-2 mb-1">
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

        {/* Enter new Skill */}
        <div className="relative w-auto">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-8"
          />

        {/* Suggestions List */}
          {showSuggestions && (
            <div ref={suggestionsRef} className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              <ul className="py-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className={cn("px-3 py-1.5 cursor-pointer text-sm", index === selectedSuggestionIndex ? "bg-blue-50" : "hover:bg-gray-50")} onClick={() => addKeyword(suggestion)}>
                    {suggestion}
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
