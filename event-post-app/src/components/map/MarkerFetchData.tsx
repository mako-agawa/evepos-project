import React, { useState } from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import type { Event } from '@/types/event.type';
import {
  getEventDate,
  getEventWeekday,
} from '../events/utils/EventDateDisplay';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  searchResults: (Event & { coordinate: google.maps.LatLngLiteral })[];
};

const MarkerFetchData: React.FC<Props> = ({ searchResults }) => {
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);

  return (
    <>
      {searchResults.map((event, index) => {
        const offset = 0.0001 * index;
        const mmdd = getEventDate(event.date);
        const weekday = getEventWeekday(event.date);

        return (
          <Marker
            key={event.id}
            position={{
              lat: event.coordinate.lat + offset,
              lng: event.coordinate.lng,
            }}
            onClick={() => setSelectedMarker(index)}
          >
            {selectedMarker === index && (
              <InfoWindow
                position={event.coordinate}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div
                  onClick={() => {
                    window.location.href = `/events/${event.id}`;
                  }}
                  className="cursor-pointer w-[140px] bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all p-2 relative"
                >
                  <div className="gap-2">
                    <div className="relative w-[120px] h-[90px] shrink-0">
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="rounded-md object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-gray-100 text-xs px-1 py-0.5 rounded flex items-center gap-1">
                        {/* <LocationMarkerIcon className="w-4 h-4 text-orange-500" /> */}
                        <p className="text-gray-600 font-semibold">
                          {event.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between w-full">
                      <h2 className="font-semibold text-sm line-clamp-2">
                        {event.title}
                      </h2>
                    </div>
                  </div>

                  <div className="absolute top-1 left-1 bg-orange-400 text-white px-2 py-1 rounded-full text-xs flex flex-col items-center">
                    <p className="font-bold">{mmdd}</p>
                    <p>({weekday})</p>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
    </>
  );
};

export default MarkerFetchData;
