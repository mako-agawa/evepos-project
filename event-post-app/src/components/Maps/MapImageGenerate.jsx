'use client'
import React, { useEffect, useState } from 'react';
import loader from '@/components/Maps/googleMapsLoader';
import { map } from 'zod';

const MapImageGenerate = ({ location }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID;

  useEffect(() => {
    if (!location) return;
    setErrorMessage(''); // 前回のエラーメッセージをクリア

    loader.load().then(async () => {
      const [{ Map }, { AdvancedMarkerElement }, { Geocoder }] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
        google.maps.importLibrary('geocoding'),
      ]);

      const geocoder = new Geocoder();
      

      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const position = results[0].geometry.location;

          const mapInstance = new Map(document.getElementById('map'), {
            center: {
              lat: position.lat(),
              lng: position.lng(),
            },
            zoom: 16,
            map: MAP_ID
          });

          // AdvancedMarkerElementの使用
          new AdvancedMarkerElement({
            map: mapInstance,
            position: position,
            content: (() => {
              const img = document.createElement('img');
              img.src = '/kkrn_icon_pin_1.png';
              img.style.width = '40px';
              img.style.height = '40px';
              img.style.transform = 'translate(-15px, -30px)';
              return img;
            })(),
          });

        } else if (status === 'ZERO_RESULTS') {
          console.warn('ジオコード結果なし（ZERO_RESULTS）');
          setErrorMessage('該当する場所が見つかりませんでした');
        } else {
          console.error('Geocode was not successful for the following reason:', status);
          setErrorMessage('該当する場所が見つかりませんでした');
        }
      });
    });
  }, [location]);

  return (
    <div className="bg-white rounded shadow-md w-full max-w-lg p-4">
      {errorMessage ? (
        <div className="text-red-500 text-sm font-semibold text-center py-4">
          {errorMessage}
        </div>
      ) : (
        <div
          id="map"
          style={{ height: '400px', width: '100%' }}
          className="rounded shadow"
        />
      )}
    </div>
  );
};

export default MapImageGenerate;