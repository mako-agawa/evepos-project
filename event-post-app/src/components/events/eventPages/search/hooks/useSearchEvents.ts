// hooks/useSearchEvents.ts
import { useState, useEffect } from 'react';
import type { Event } from '@/types/event.type';

export const useSearchEvents = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [triggerSearch, setTriggerSearch] = useState(false);
 

  useEffect(() => {
    if (!triggerSearch) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `/events/search?query=${searchKeyword}`
        );
        const data = await response.json();

        if (response.ok) {
          setSearchResults(data);
          const locations = data.map((event: Event) => event.location).filter(Boolean);

        } else {
          console.error('Error fetching events:', data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setTriggerSearch(false);
      }
    };

    fetchData();
  }, [triggerSearch, searchKeyword]);

  return {
    searchKeyword,
    setSearchKeyword,
    searchResults,
    setSearchResults,
    triggerSearch,
    setTriggerSearch,
  };
};