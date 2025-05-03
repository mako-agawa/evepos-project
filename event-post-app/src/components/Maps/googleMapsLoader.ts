// src/lib/googleMapsLoader.js
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places'], // 最初から使う可能性のある全てのライブラリをここに書く
});

export default loader;