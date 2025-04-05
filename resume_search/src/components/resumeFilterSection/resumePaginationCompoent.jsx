"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"

const PaginationFilter = ({
  totalPages = 1,
  currentPage = 1,
  onPageChange = () => {},
  onSortChange = () => {},
  onShowCountChange = () => {},
}) => {
  const [sort, setSort] = useState("Relevance")
  const [showCount, setShowCount] = useState("40")

  const handleSortChange = (value) => {
    setSort(value)
    onSortChange(value)
  }

  const handleShowCountChange = (value) => {
    setShowCount(value)
    onShowCountChange(value)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      {/* Sort By on the left */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Sort by:</span>
        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px] h-9 border-gray-300 bg-white">
            <SelectValue placeholder="Relevance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Relevance">Relevance</SelectItem>
            <SelectItem value="Newest">Newest</SelectItem>
            <SelectItem value="Price: Low to High">Price: Low to High</SelectItem>
            <SelectItem value="Price: High to Low">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Show count and Pagination on the right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show</span>
          <Select value={showCount} onValueChange={handleShowCountChange}>
            <SelectTrigger className="w-[80px] h-9 border-gray-300 bg-white">
              <SelectValue placeholder="40" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="60">60</SelectItem>
              <SelectItem value="80">80</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Pagination>
          <PaginationContent className="flex items-center">
            <PaginationItem>
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className={`h-9 w-9 flex items-center justify-center rounded-md border border-gray-300 ${
                  currentPage <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                }`}
                aria-label="Go to previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </PaginationItem>

            <div className="mx-2 flex items-center">
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <PaginationItem>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className={`h-9 w-9 flex items-center justify-center rounded-md border border-gray-300 ${
                  currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                }`}
                aria-label="Go to next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default PaginationFilter