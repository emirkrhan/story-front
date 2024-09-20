import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import PostView from '../components/PostView';
import Navbar from '../components/Navbar';
const apiUrl = process.env.REACT_APP_API_URL;
function Library() {

    const myUserId = localStorage.getItem('storyUserId');

    const libraryQuery = useQuery({
        queryKey: ["library", myUserId],
        queryFn: () => axios.get(`${apiUrl}/savedstory/${myUserId}`).then(res => res.data)
    });

    const library = libraryQuery.data;
    const isLoading = libraryQuery.isLoading;
    const error = libraryQuery.error;

    if (isLoading) return <div className="w-11/12 h-64 bg-slate-300 mt-6 rounded-lg pt-4 px-4"></div>
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="w-full min-h-screen h-auto px-4 bg-[#eeeff0]">
            <Navbar progressBar={false} animation={true} />
            <div className="w-full flex items-center justify-center flex-wrap pt-24">
                {library.map((post) => (
                    <div key={post.id} className="w-1/2">
                        <PostView post={post} />
                    </div>
                ))}
            </div>


        </div>
    )
}

export default Library