import React from 'react'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PostView from '../components/PostView';
import Navbar from '../components/Navbar'
import '../components/button.css'
import ImageCarousel from '../components/ImageCarousel';
const apiUrl = process.env.REACT_APP_API_URL;
function HomePage() {


    const usersQuery = useQuery({
        queryKey: ['random-users'],
        queryFn: () => axios.get(`${apiUrl}/users/randomUsers`).then(res => res.data)
    });


    const { data: posts, isLoading: postsLoading, error: postsError } = useQuery({
        queryKey: ["posts"],
        queryFn: () => axios.get(`${apiUrl}/stories`).then(res => res.data)
    });

    const topTagsQuery = useQuery({
        queryKey: ["toptags"],
        queryFn: () => axios.get(`${apiUrl}/stories/top-tags`).then(res => res.data)
    });

    const topTags = topTagsQuery.data;
    const users = usersQuery.data;

    if (postsLoading) return <div><span className="loader"></span></div>;
    if (postsError) return <div>An error occurred: {postsError.message}</div>;

    const username = localStorage.getItem('storyUserName');

    return (
        <div className=" w-full min-h-screen h-auto bg-[#eeeff0] flex z-0">
            <div className="w-full h-auto min-h-screen pt-16">
                <Navbar progressBar={false} animation={true} />
                <div className='w-full h-auto'>
                    <header>
                        <div className="mx-auto max-w-screen-xl px-8 pt-8 pb-8">
                            <div className="sm:flex sm:items-center sm:justify-between">
                                <div className="text-center sm:text-left">
                                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Hoşgeldin, {username}!</h1>

                                    <p className="mt-1.5 text-sm text-gray-500">Bugüne yeni bir şeyler yazarak başla 🎉</p>
                                </div>

                                <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">


                                    <a href='/create'
                                        className="block rounded-lg bg-[#7469b6] px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
                                        type="button"
                                    >
                                        Oluştur
                                    </a>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>

                <div className='w-full min-h-screen h-auto flex'>
                    <div className="w-8/12 h-auto flex flex-col items-center">
                        <div className='w-11/12 h-auto bg-white mb-6 rounded-lg pt-2 px-6 flex flex-col items-center'>
                            <div className='w-full h-12 flex items-center font-bold text-xl'>Bu Haftanın Enleri</div>
                            <ImageCarousel />
                        </div>
                        {posts?.map((post) => (
                            <PostView key={post.id} post={post} />
                        ))}
                    </div>

                    <div className="w-4/12 h-auto flex flex-col">
                        <div className='w-11/12 h-auto min-h-40 mb-4 bg-white rounded-lg pb-2'>
                            <div className='w-full p-4 text-black font-semibold text-base'>Takip Et</div>
                            {users ? (
                                users.map(user => (
                                    <div key={user.id} className='w-full h-12 flex'>
                                        <div className='w-16 h-12 flex items-center justify-center'>
                                            <img
                                                src={user && user.id ? `${apiUrl}/uploads/${user.id}.jpg` : ""}
                                                alt="resim"
                                                className="w-8 h-8 rounded-full"
                                            />
                                        </div>
                                        <div className='w-44 h-12'>
                                            <div className='w-44 h-6 flex items-end text-sm font-semibold'>{user.fullName}</div>
                                            <div className='w-44 h-6 flex items-start font-medium text-xs text-gray-700 truncate'>{'@' + user.userName}</div>
                                        </div>
                                        <div className='flex-1 flex pr-8 justify-end items-center'>
                                            <a href={`/user/${user.id}`} className='px-4 py-2 rounded-full text-xs bg-black hover:bg-gray-800 text-white'>Profili Gör</a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>Loading users...</div>
                            )}

                        </div>
                        <div className='w-11/12 h-auto min-h-40 mb-4 bg-white rounded-lg pb-2 sticky top-20'>
                            <div className='w-full p-4 text-black font-semibold text-base'>Popüler Etiketler</div>
                            {topTags ? (topTags.map((tag, index) => (
                                <a href={`/tag/${tag.name}`} key={index} className='w-full h-auto cursor-pointer *:px-6 *:py-1 flex *:flex *:items-center hover:bg-slate-100'>
                                    <div className='w-4/5 h-auto'>#{tag.name} </div>
                                    <div className='w-1/5 h-auto justify-center'>{tag.value}</div>
                                </a>
                            ))) : ""}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HomePage