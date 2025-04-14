import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { config } from "@/config"

const AutocompleteInput = ({placeholder,inputValue,setInputValue,apiEndPoint}) => {
  // const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  const fetchSearchData = async (query) => {
    try {
      console.log("Search Query : ",query)
      const myHeaders = new Headers();
      myHeaders.append("Cookie", "full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_lang=en");
  
      const response = await fetch(`${config.backendUrl}/${apiEndPoint}?q=${query}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }; 

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      fetchSearchData(inputValue).then((response) => {
        const filtered = response.message
        setSuggestions(filtered)
        // Only show suggestions if we have results and user is typing
        setShowSuggestions(filtered.length > 0)
        setSelectedIndex(-1)
      });
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [inputValue])

  // Handle click outside to close suggestions
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

  const selectOption = (option) => {
    setInputValue(option)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      selectOption(suggestions[selectedIndex])
      setShowSuggestions(false)
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="w-full">
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
          // Show suggestions only when typing
          if (e.target.value.trim()) {
            setShowSuggestions(true)
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full"
      />

      {(showSuggestions && inputValue.length > 0) && (
        <div
          ref={suggestionsRef}
          className="z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={cn(
                  "px-3 py-2 cursor-pointer text-sm",
                  index === selectedIndex ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50",
                )}
                onClick={() => selectOption(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AutocompleteInput;
