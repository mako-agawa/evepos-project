// hooks/useSearchEvents.ts
import { useState, useEffect } from 'react';
import type { Event } from '@/types/event.type';

export const useSearchEvents = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [locationValues, setLocationValues] = useState<string[]>(['中野区']);
  const [triggerSearch, setTriggerSearch] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!triggerSearch) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/events/search?query=${searchKeyword}`
        );
        const data = await response.json();

        if (response.ok) {
          setSearchResults(data);
          const locations = data.map((event: Event) => event.location).filter(Boolean);
          setLocationValues(locations);
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
  }, [triggerSearch, searchKeyword, API_URL]);

  return {
    searchKeyword,
    setSearchKeyword,
    searchResults,
    setSearchResults,
    triggerSearch,
    setTriggerSearch,
    locationValues,
  };
};