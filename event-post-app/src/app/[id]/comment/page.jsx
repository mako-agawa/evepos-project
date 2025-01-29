import CommentForm from '@/components/comments/CommentForm';

import React from 'react';

const Page = () => {
    return (
        <div className="flex flex-col h-screen bg-gray-100 py-8">
            <div className='mx-8 mt-24'>
                <CommentForm />

            </div>
        </div>
    );
}

export default Page;