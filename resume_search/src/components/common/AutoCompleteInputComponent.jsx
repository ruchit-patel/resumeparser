import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { config } from "@/config";

const AutocompleteInput = ({ placeholder, inputValue, setInputValue, apiEndPoint }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastFetchedQuery, setLastFetchedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchSearchData = async (query) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/${apiEndPoint}?q=${query}`);
      const result = await response.json();
      return result.message || [];
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestions = async (query) => {
    if (!query.trim() || query === lastFetchedQuery) return;

    const data = await fetchSearchData(query);
    setSuggestions(data);
    setLastFetchedQuery(query);
  };

  // Fetch suggestions when search query changes
  useEffect(() => {
    if (searchQuery.trim() && open) {
      const debounceTimer = setTimeout(() => {
        getSuggestions(searchQuery);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery, open]);

  // Load suggestions when popover opens
  useEffect(() => {
    if (open && suggestions.length === 0) {
      // Load initial suggestions or use current inputValue if available
      const initialQuery = inputValue || "";
      if (initialQuery) {
        getSuggestions(initialQuery);
      }
    }
  }, [open]);

  const selectOption = (option) => {
    setInputValue(option);
    setOpen(false);
    setSearchQuery("");
  };

  // Filter suggestions based on search query
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <span className={cn(
              "truncate",
              !inputValue && "text-muted-foreground"
            )}>
              {inputValue || placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder={`Search ${placeholder?.toLowerCase() || 'options'}...`}
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <CommandList className="max-h-60 overflow-auto">
              {isLoading ? (
                <div className="py-6 px-3 text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : filteredSuggestions.length === 0 ? (
                <CommandEmpty>
                  {searchQuery ? `No results found for "${searchQuery}"` : 'Start typing to search...'}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredSuggestions.map((suggestion, index) => (
                    <CommandItem
                      key={index}
                      value={suggestion}
                      onSelect={() => selectOption(suggestion)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          inputValue === suggestion ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AutocompleteInput;
