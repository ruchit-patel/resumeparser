
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Clock } from 'lucide-react'; 
import { useFrappeGetDocList } from 'frappe-react-sdk';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
const RecentSearches = ({
  applySearch,
  selectedSearchId,
  onClearFields,
}) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const { data, error, isValidating, mutate } = useFrappeGetDocList("Seach History",{fields: ['*']})
  

  dayjs.extend(relativeTime);

  const getTimeAgo = (dateStr) => {
    // Remove microseconds & format for JS
    const cleanDate = dateStr.split('.')[0].replace(' ', 'T');
    return dayjs(cleanDate).fromNow();  // e.g., "a few seconds ago"
  };



  useEffect(() => {
    if(data){
    console.log(data," : data");
    setRecentSearches(data);
  }
  }, [data]);

  const clearSearchHistory = () => {
    setRecentSearches([]);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold flex items-center text-gray-800">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            Recent Searches
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-w-[120px]"
            onClick={onClearFields}
          >
            Clear Search Fields
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-w-[120px]"
            onClick={clearSearchHistory}
          >
            Clear Search History
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {recentSearches.length === 0 ? (
          <p className="text-sm text-gray-500">No recent searches found.</p>
        ) : (
          recentSearches.map((search) => {
            const isSelected = selectedSearchId === search.name;
            return (
              <div
                key={search.name}
                className={`rounded-md p-3 cursor-pointer border transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => applySearch(JSON.parse(search.save_form), search.name)}
              >
                
                <div className="flex flex-col justify-between items-start mt-1">
                  <p
                    className={`text-xs ${
                      isSelected ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {/* {JSON.parse(search.save_form).searchKeywords.map((skill) => skill.text).join(', ')} */}
                    {
                      (() => {
                        const skills = JSON.parse(search.save_form).searchKeywords.map(skill => skill.text).join(', ');
                        return skills.length > 10 ? skills.slice(0, 25) + '...' : skills;
                      })()
                    }
                  </p>
                  <p
                    className={`text-xs ${
                      isSelected ? 'text-blue-500' : 'text-gray-400'
                    }`}
                  >
                    {getTimeAgo(search.creation)}

                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default RecentSearches;
