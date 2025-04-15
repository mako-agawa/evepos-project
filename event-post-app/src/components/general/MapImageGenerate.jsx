'use client'
import React, { useEffect, useState } from 'react';
import loader from '@/lib/googleMapsLoader';

const MapImageGenerate = ({ location }) => {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!location) return;

    setErrorMessage(''); // 前回のエラーメッセージをクリア

    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary('maps');
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const position = results[0].geometry.location;

          const mapInstance = new Map(document.getElementById('map'), {
            center: {
              lat: position.lat(),
              lng: position.lng(),
            },
            zoom: 16,
          });

          const marker = new google.maps.Marker({
            position: {
              lat: position.lat(),
              lng: position.lng(),
            },
            map: mapInstance, // ← 地図にマーカーを表示するには必須
            icon: {
              url: '/kkrn_icon_pin_1.png',
              scaledSize: new google.maps.Size(40, 40), // マーカーのサイズを指定
              origin: new google.maps.Point(0, 0), // マーカーの画像の原点
              anchor: new google.maps.Point(15, 30), // マーカーの画像のアンカー
            },
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