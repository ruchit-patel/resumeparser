import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { config } from "@/config";

const AutocompleteInput = ({ placeholder, inputValue, setInputValue, apiEndPoint }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [lastFetchedQuery, setLastFetchedQuery] = useState("");

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const fetchSearchData = async (query) => {
    try {
      const response = await fetch(`/${apiEndPoint}?q=${query}`);
      const result = await response.json();
      return result.message || [];
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  };

  const getSuggestions = async (query) => {
    if (!query.trim() || query === lastFetchedQuery) return;

    const data = await fetchSearchData(query);
    setSuggestions(data);
    setLastFetchedQuery(query);
    setShowSuggestions(data.length > 0);
    setSelectedIndex(-1);
  };

  // Removed automatic API call on inputValue change to prevent suggestions for pre-filled data

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

  const selectOption = (option) => {
    setInputValue(option);
    setShowSuggestions(false);
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
      selectOption(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    } else {
      // Only fetch suggestions when user is typing
      if (inputValue.trim()) {
        getSuggestions(inputValue);
      }
    }
  };

  return (
    <div className="w-full relative">
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          // Only fetch suggestions when user is typing
          if (e.target.value.trim()) {
            getSuggestions(e.target.value);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }}
        onClick={() => {
          // Only fetch suggestions on click if there's text and user is actively interacting
          if (inputValue.trim()) {
            getSuggestions(inputValue);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full"
      />

      {(showSuggestions && inputValue.length > 0) && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={cn(
                  "px-3 py-2 cursor-pointer text-sm",
                  index === selectedIndex
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-50"
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
  );
};

export default AutocompleteInput;
