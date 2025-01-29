import CommentForm from '@/components/comments/CommentForm';

import React from 'react';

const Page = () => {
    return (
        <div className="flex flex-col items-center bg-gray-100 py-8">
            <CommentForm />
        </div>
    );
}

export default Page;