"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Simulated API function
const fetchSuggestions = async (query) => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const items = [
    "Apple",
    "Application",
    "Apartment",
    "Appearance",
    "Appetite",
    "Banana",
    "Baseball",
    "Basketball",
    "Battery",
    "Beach",
    "Camera",
    "Car",
    "Cat",
    "Computer",
    "Coffee",
    "Dog",
    "Door",
    "Desk",
    "Diamond",
    "Dinner",
    "Elephant",
    "Email",
    "Engine",
    "Eagle",
    "Earth",
  ]
  return items.filter((item) => query.length > 0 && item.toLowerCase().includes(query.toLowerCase()))
}

const SearchBar = () => {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const suggestionRef = useRef(null)

  const getLastWord = (text) => {
    const parts = text.split(",")
    return parts[parts.length - 1].trim()
  }

  useEffect(() => {
    const getSuggestions = async () => {
      const lastWord = getLastWord(query)
      if (lastWord.length > 0) {
        setIsLoading(true)
        const results = await fetchSuggestions(lastWord)
        setSuggestions(results)
        setIsLoading(false)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }

    const timeoutId = setTimeout(() => {
      getSuggestions()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectSuggestion = (suggestion) => {
    const parts = query.split(",")
    parts[parts.length - 1] = suggestion
    setQuery(parts.join(","))
    setShowSuggestions(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0))
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[selectedIndex])
      } else if (suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0])
      }
    }
  }

  return (
    <div className="relative w-full mx-auto">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Enter keywords like skills, designation, and company"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          className="pr-10"
        />
        <Button size="icon" variant="ghost" onClick={() => alert("Search: " + query)} className="absolute right-0 top-0 h-full px-20 text-muted-foreground">
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <div className="flex gap-2 items-center hover:border-gray-950">
                <Search className="h-4 w-4" />
            Click to Search
            </div>
            
          )
          }
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionRef}
          className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`px-4 py-2 cursor-pointer ${index === selectedIndex ? "bg-muted" : "hover:bg-muted"}`}
                onClick={() => handleSelectSuggestion(suggestion)}
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

export default SearchBar;
