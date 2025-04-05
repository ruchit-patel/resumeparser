import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronUp, ChevronDown } from "lucide-react";

const FilterSection = ({ title, value, onChange, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-md bg-white shadow-sm"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 cursor-pointer">
        <h3 className="text-sm font-medium">{title}</h3>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent className="p-3 pt-0">
        {content || (
          <Input
            placeholder={`Search ${title.toLowerCase()}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8"
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FilterSection;
