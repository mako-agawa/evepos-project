'use client';

import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

type Props = {
  location: string;
};

const MapImageGenerate: React.FC<Props> = ({ location }) => {
  const [coordinates, setCoordinates] =
    useState<google.maps.LatLngLiteral | null>(null);

  const [errorMessage, setErrorMessage] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  useEffect(() => {
    if (!location) return;
    setErrorMessage('');
    setCoordinates(null);

    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            location
          )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();

        if (data.status === 'OK' && data.results[0]) {
          const loc = data.results[0].geometry.location;
          setCoordinates({ lat: loc.lat, lng: loc.lng });
        } else {
          setErrorMessage('該当する場所が見つかりませんでした');
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('ジオコーディングに失敗しました');
      }
    };

    fetchCoordinates();
  }, [location]);

  if (!isLoaded) return <div>地図を読み込み中...</div>;

  return (
    <div className="bg-white rounded shadow-md w-full max-w-lg p-4">
      {errorMessage ? (
        <div className="text-red-500 text-sm font-semibold text-center py-4">
          {errorMessage}
        </div>
      ) : (
        <div className="rounded shadow">
          {coordinates && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={coordinates}
              zoom={15}
              options={{ mapId: process.env.NEXT_PUBLIC_MAP_ID }}
            >
              <Marker
                position={coordinates}
                // icon={{
                //   url: '/kkrn_icon_pin_1.png',
                //   scaledSize: new google.maps.Size(40, 40), // 幅30px、高さ30pxに縮小
                //   anchor:new google.maps.Point(15, 30), // ピンの先端を基準にする
                // }}
              />
            </GoogleMap>
          )}
        </div>
      )}

      
    </div>
  );
}


export default MapImageGenerate;
