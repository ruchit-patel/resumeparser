import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Clock } from 'lucide-react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const getTimeAgo = (dateStr) => {
  const cleanDate = dateStr?.split('.')[0]?.replace(' ', 'T');
  return cleanDate ? dayjs(cleanDate).fromNow() : '';
};

const RecentSearches = ({ applySearch, selectedSearchId, onClearFields }) => {
  const [viewAllModalOpen, setViewAllModalOpen] = useState(false);
  const [allSearches, setAllSearches] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 20;

  const listRef = useRef(null);

  // Fetch recent 8 for main view
  const { data: recentSearches = [] } = useFrappeGetDocList('Seach History', {
    fields: ['*'],
    limit: 8,
    orderBy: { field: 'creation', order: 'desc' },
  });

  const fetchSearchBatch = useCallback(async (offset = 0) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/method/frappe.client.get_list?doctype=Seach History&fields=["*"]&limit=${limit}&order_by=creation desc&limit_start=${offset}`
      );
      const result = await res.json();
      const newItems = result?.message || [];

      if (newItems.length < limit) setHasMore(false);
      setAllSearches((prev) => [...prev, ...newItems]);
    } catch (err) {
      console.error('Error loading search history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (viewAllModalOpen) {
      setAllSearches([]);
      setHasMore(true);
      fetchSearchBatch(0);
    }
  }, [viewAllModalOpen, fetchSearchBatch]);

  // Scroll handler
  useEffect(() => {
    const el = listRef.current;
    if (!el || !viewAllModalOpen) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight - scrollTop - clientHeight < 50 && hasMore && !loading) {
        fetchSearchBatch(allSearches.length);
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [viewAllModalOpen, hasMore, loading, allSearches.length, fetchSearchBatch]);

  const handleApplySearch = (rawData, id) => {
    try {
      applySearch(JSON.parse(rawData), id);
      setViewAllModalOpen(false);
    } catch (err) {
      console.error('Invalid JSON in save_form', err);
    }
  };

  const renderSearchItem = (search, isSelected) => {
    try {
      const parsed = JSON.parse(search.save_form);
      const keywords = parsed.searchKeywords || [];
      const displayText = keywords.map((k) => k.text).join(', ').slice(0, 25) + (keywords.length > 25 ? '...' : '');

      return (
        <div
          key={search.name}
          className={`rounded-md p-3 cursor-pointer border transition-colors ${
            isSelected
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => handleApplySearch(search.save_form, search.name)}
        >
          <p className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
            {displayText}
          </p>
          <p className={`text-xs mt-1 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}>
            {getTimeAgo(search.creation)}
          </p>
        </div>
      );
    } catch (err) {
      return (
        <div key={search.name} className="rounded-md p-3 border border-red-200 bg-red-50">
          <p className="text-xs text-red-500">Invalid search data</p>
        </div>
      );
    }
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
          <Button variant="outline" size="sm" className="flex-1 min-w-[120px]" onClick={onClearFields}>
            Clear Search Fields
          </Button>

          <Dialog open={viewAllModalOpen} onOpenChange={setViewAllModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 min-w-[120px]">
                View All Searches
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>All Search History</DialogTitle>
              </DialogHeader>

              <div ref={listRef} className="overflow-y-auto h-[60vh] space-y-2 pr-2 mt-4">
                {allSearches.length === 0 && loading && (
                  <p className="text-sm text-gray-400 text-center py-4">Loading searches...</p>
                )}

                {allSearches.length === 0 && !loading && (
                  <p className="text-sm text-gray-500 text-center py-4">No search history found.</p>
                )}

                {allSearches.map((search) =>
                  renderSearchItem(search, selectedSearchId === search.name)
                )}

                {loading && allSearches.length > 0 && (
                  <p className="text-sm text-gray-400 text-center py-2">Loading more searches...</p>
                )}

                {!hasMore && allSearches.length > 0 && (
                  <p className="text-sm text-gray-400 text-center py-2">
                    You've reached the end of your search history.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {recentSearches.length === 0 ? (
          <p className="text-sm text-gray-500">No recent searches found.</p>
        ) : (
          recentSearches.map((search) =>
            renderSearchItem(search, selectedSearchId === search.name)
          )
        )}
      </CardContent>
    </Card>
  );
};

export default RecentSearches;
