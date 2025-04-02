import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';

const RecentSearches = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h2 className="text-lg font-semibold flex items-center">
          <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Searches
        </h2>
        <Button variant="link" className="text-sm text-blue-600 hover:text-blue-800">View all</Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Recent Search Item 1 */}
        <div className="border-b pb-3">
          <p className="text-sm text-gray-800 mb-1">vuthamarikanth2016@gmail.com</p>
          <div className="flex justify-between">
            <Button variant="link" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
              Fix this search
            </Button>
            <Button variant="link" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
              Search profiles
            </Button>
          </div>
        </div>
        
        {/* Recent Search Item 2 */}
        <div className="border-b pb-3">
          <p className="text-sm text-gray-800 mb-1">vuthamarikanth2016@gmail.com</p>
          <div className="flex justify-between">
            <Button variant="link" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
              Fix this search
            </Button>
            <Button variant="link" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
              Search profiles
            </Button>
          </div>
        </div>
        
        {/* Recent Search Item 3 */}
        <div className="border-b pb-3">
          <p className="text-sm text-gray-800 mb-1">Embedded C++, RTOS | Embedded C, Linux | 5-11 years | 14-16 Lacs | Bengaluru</p>
          <div className="flex justify-between">
            <Button variant="link" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
              Fix this search
            </Button>
            <Button variant="link" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
              Search profiles
            </Button>
          </div>
        </div>
        
        {/* Recent Search Item 4 */}
        <div className="border-b pb-3">
          <p className="text-sm text-gray-800 mb-1">OOPS, Design Patterns, SOLID, Product Ownership, Agile | 6-11 years | 10-15 Lacs | Bengaluru</p>
          <div className="flex justify-between">
            <Button variant="link" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
              Fix this search
            </Button>
            <Button variant="link" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
              Search profiles
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardContent className="pt-4">
        <h2 className="text-lg font-semibold mb-4">Saved Searches</h2>
        
        {/* Saved Search Item */}
        <div className="border-b pb-3">
          <p className="text-sm text-gray-800 mb-1">SSE Dev Net</p>
          <p className="text-xs text-gray-600 mb-1">.Net Core, Angular, Full Stack, .Net Developer, Azure DevOps, Web API, SQL Server, Agile Methodology, C# | 1-7 years | 7-7 Lacs</p>
          <div className="flex justify-between">
            <Button variant="link" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
              Fix this search
            </Button>
            <Button variant="link" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
              Try new profiles
            </Button>
          </div>
        </div>
        
        {/* More Saved Search Items */}
        <div className="border-b pb-3 mt-3">
          <p className="text-sm text-gray-800 mb-1">SE- Kerala</p>
          <p className="text-xs text-gray-600 mb-1">Sales | 0-5 years | 1-6 Lacs | Kollam, Palakkad, Alathur, Chittur, Ottapalam, Mannarkad, Perinthalmanna, Taliparamba, Payyanur, Kanhangad</p>
          <div className="flex justify-between">
            <Button variant="link" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
              Fix this search
            </Button>
            <Button variant="link" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
              100+ new profiles
            </Button>
          </div>
        </div>
        
        <div className="border-b pb-3 mt-3">
          <p className="text-sm text-gray-800 mb-1">IR</p>
          <p className="text-xs text-gray-600 mb-1">Human Selection, Screening, Shortlisting, Sourcing Profiles | IT recruitment | 1-2 Lacs</p>
          <div className="flex justify-between">
            <Button variant="link" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
              Fix this search
            </Button>
            <Button variant="link" className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">
              100+ new profiles
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSearches;
