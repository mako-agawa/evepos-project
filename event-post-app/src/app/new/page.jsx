import EventCreate from '@/components/events/EventCreate';
import React from 'react';

const Page = () => {
    return (
        <div className="flex flex-col items-center bg-gray-100 py-8">
            <EventCreate />
        </div>
    );
}

export default Page;