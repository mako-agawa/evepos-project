'use client';

import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

type Props = {
  locations: string[]; // 配列に変更
};

const MapImageGenerate: React.FC<Props> = ({ locations }) => {
  const [coordinatesList, setCoordinatesList] = useState<
    google.maps.LatLngLiteral[]
  >([]);
  const [errorMessage, setErrorMessage] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  useEffect(() => {
    setErrorMessage('');
    if (!locations || locations.length === 0) {
      setErrorMessage('該当する場所が見つかりませんでした');
      return;
    }
    setCoordinatesList([]);

    const fetchAllCoordinates = async () => {
      const results: google.maps.LatLngLiteral[] = [];

      for (const location of locations) {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              location
            )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();

          if (data.status === 'OK' && data.results[0]) {
            const loc = data.results[0].geometry.location;
            results.push({ lat: loc.lat, lng: loc.lng });
          } else {
            setErrorMessage('該当する場所が見つかりませんでした');
          }
        } catch (error) {
          console.error(`ジオコーディング失敗: ${location}`, error);
        }
      }

      if (results.length > 0) {
        setCoordinatesList(results);
      } else {
        setErrorMessage('該当する場所が見つかりませんでした');
      }
    };

    fetchAllCoordinates();
  }, [locations]);

  if (!isLoaded) return <div>地図を読み込み中...</div>;

  return (
    <div className="bg-white rounded shadow-md w-full max-w-lg p-4">
      {errorMessage ? (
        <div className="text-red-500 text-sm font-semibold text-center py-4">
          {errorMessage}
        </div>
      ) : coordinatesList.length > 0 ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={coordinatesList[0]} // 最初の地点を中心に
          zoom={13}
          options={{ mapId: process.env.NEXT_PUBLIC_MAP_ID }}
        >
          {coordinatesList.map((coord, index) => (
            <Marker key={index} position={coord} />
          ))}
        </GoogleMap>
      ) : null}
    </div>
  );
};

export default MapImageGenerate;
