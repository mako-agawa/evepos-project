'use client';

import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import MarkerFetchData from './MarkerFetchData';
import type { Event } from '@/types/event.type';

const containerStyle = {
  width: '100%',
  height: '400px',
};

type Props = {
  searchResults: Event[]; // 配列に変更
};

const MapImageGenerate: React.FC<Props> = ({ searchResults }) => {
  const [eventsWithCoordinates, setEventsWithCoordinates] = useState<
    (Event & { coordinate: google.maps.LatLngLiteral })[]
  >([]);

  const [errorMessage, setErrorMessage] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const GOOGLE_MAPS_GEOCODE_URL =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_GEOCODE_URL;

  useEffect(() => {
    setErrorMessage('');
    if (!searchResults || searchResults.length === 0) {
      setErrorMessage('該当する場所が見つかりませんでした');
      return;
    }
    setEventsWithCoordinates([]);

    const fetchAllCoordinates = async () => {
      const results: (Event & { coordinate: google.maps.LatLngLiteral })[] = [];

      for (const event of searchResults) {
        try {
          const response = await fetch(
            `${GOOGLE_MAPS_GEOCODE_URL}?address=${encodeURIComponent(
              event.location
            )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();

          if (data.status === 'OK' && data.results[0]) {
            const loc = data.results[0].geometry.location;
            results.push({
              ...event,
              coordinate: { lat: loc.lat, lng: loc.lng },
            });
          } else {
            setErrorMessage('該当する場所が見つかりませんでした');
          }
        } catch (error) {
          console.error(`ジオコーディング失敗: ${event}`, error);
        }
      }

      if (results.length > 0) {
        setEventsWithCoordinates(results);
      } else {
        setErrorMessage('該当する場所が見つかりませんでした');
      }
    };

    fetchAllCoordinates();
  }, [searchResults]);

  if (!isLoaded) return <div>地図を読み込み中...</div>;

  return (
    <div className="bg-white rounded shadow-md w-full max-w-lg p-4">
      {errorMessage ? (
        <div className="text-red-500 text-sm font-semibold text-center py-4">
          {errorMessage}
        </div>
      ) : eventsWithCoordinates.length > 0 ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={eventsWithCoordinates[0].coordinate} // 最初の地点を中心に
          zoom={13}
          options={{ mapId: process.env.NEXT_PUBLIC_MAP_ID }}
        >
          <MarkerFetchData searchResults={eventsWithCoordinates} />
        </GoogleMap>
      ) : null}
    </div>
  );
};

export default MapImageGenerate;
