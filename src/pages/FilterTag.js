import React from 'react'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PostView from '../components/PostView';
import Navbar from '../components/Navbar'
import '../components/button.css'
import { useParams } from 'react-router-dom';

function FilterTag() {
    
    const apiUrl = process.env.REACT_APP_API_URL;
    const { tag } = useParams();

    const { data: stories, isLoading: storiesLoading, error: storiesError } = useQuery({
        queryKey: ['filter-tag', tag],
        queryFn: () => axios.get(`${apiUrl}/stories/getAllStoryByTag/${tag}`).then(res => res.data)
    });

    if (storiesLoading) return <div><span className="loader"></span></div>;
    if (storiesError) return <div>An error occurred: {storiesError.message}</div>;

    return (
        <div className=" w-full min-h-screen h-auto bg-[#eeeff0] flex z-0">
            <div className="w-full h-auto min-h-screen pt-16">
                <Navbar progressBar={false} animation={true} />
                <div className='w-full h-auto'>
                    <header>
                        <div className="mx-auto max-w-screen-xl px-8 pt-8 pb-8">
                            <div className="sm:flex sm:items-center sm:justify-between">
                                <div className="text-center sm:text-left">
                                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">#{tag}</h1>

                                    <p className="mt-1.5 text-sm text-gray-500">Belirli bir etikete sahip popüler hikayeler arasında kaybol</p>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>

                <div className='w-full min-h-screen h-auto flex'>
                    <div className="w-8/12 h-auto flex flex-col items-center">
                        {stories?.map((post) => (
                            <PostView key={post.id} post={post} />
                        ))}
                    </div>

                </div>

            </div>
        </div>
    )
}

export default FilterTag