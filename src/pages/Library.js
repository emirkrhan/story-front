import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import PostView from '../components/PostView';

function Library() {

    const myUserId = localStorage.getItem('storyUserId');

    const libraryQuery = useQuery({
        queryKey: ["library", myUserId],
        queryFn: () => axios.get(`http://localhost:8080/savedstory/${myUserId}`).then(res => res.data)
    });

    const library = libraryQuery.data;
    const isLoading = libraryQuery.isLoading;
    const error = libraryQuery.error;

    if (isLoading) return <div className="w-11/12 h-64 bg-slate-300 mt-6 rounded-lg pt-4 px-4"></div>
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container mx-auto px-4 bg-[#eeeff0]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {library.map((post) => (
                    <PostView key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}

export default Library