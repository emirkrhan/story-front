import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import PostView from '../components/PostView';
import Interactions from './Interactions';
import Navbar from '../components/Navbar';

function Followers() {

    const { userId } = useParams();
    const myUserId = localStorage.getItem('storyUserId');
    const [activeTab, setActiveTab] = useState("stories")


    const { data: user, isLoading: userLoading, error: userError } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => axios.get(`http://localhost:8080/users/${userId}`).then(res => res.data)
    });

    const { data: follower, isLoading: followerLoading, error: followerError } = useQuery({
        queryKey: ["follower", userId],
        queryFn: () => axios.get(`http://localhost:8080/follows/follower/${userId}`).then(res => res.data)
    });

    const { data: followed, isLoading: followedLoading, error: followedError } = useQuery({
        queryKey: ["followed", userId],
        queryFn: () => axios.get(`http://localhost:8080/follows/followed/${userId}`).then(res => res.data)
    });

    const { data: followerCount, isLoading: followerCountLoading, error: followerCountError } = useQuery({
        queryKey: ["followerCount", userId],
        queryFn: () => axios.get(`http://localhost:8080/follows/followerCount/${userId}`).then(res => res.data)
    });

    const followedCountQuery = useQuery({
        queryKey: ["followedCount", userId],
        queryFn: () => axios.get(`http://localhost:8080/follows/followedCount/${userId}`).then(res => res.data)
    });

    const followedCount = followedCountQuery.data;

    const { data: posts, isLoading: postsLoading, error: postsError } = useQuery({
        queryKey: ["stories", userId],
        queryFn: () => axios.get(`http://localhost:8080/stories/getUserStory/${userId}`).then(res => res.data)
    });

    const followCheckQuery = useQuery({
        queryKey: ["followCheck", myUserId, userId],
        queryFn: () => axios.get(`http://localhost:8080/follows/followCheck/${myUserId}/${userId}`).then(res => res.data)
    });

    const followCheck = followCheckQuery.data;

    const { data: interactions, isLoading: interactionsLoading, error: interactionsError } = useQuery({
        queryKey: ["interactions", userId],
        queryFn: () => axios.get(`http://localhost:8080/users/getUserInteractions/${userId}`).then(res => res.data)
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const monthNames = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];

        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day} ${month} ${hours}:${minutes}`;
    };

    const mutationFollow = useMutation({
        mutationFn: () => {
            if (followCheck) {
                return axios.delete('http://localhost:8080/follows/unfollow', { data: { followerId: myUserId, followedId: userId } });
            } else {
                return axios.post(`http://localhost:8080/follows?followerId=${myUserId}&followedId=${userId}&size=5`)
            }
        },
        onSuccess: () => {
            followedCountQuery.refetch();
            followCheckQuery.refetch();
        }
    })

    return (


        <div className='w-full h-auto min-h-screen flex bg-[#eeeff0] pt-16'>
            <Navbar />
            <div className='w-1/3 h-auto pl-28 pt-10 flex flex-col gap-2'>
                <div className='w-full h-auto flex flex-col rounded-lg bg-white py-4'>
                    <div className='w-full py-2 flex items-center justify-center'>
                        <img src={`http://localhost:8080/uploads/${userId}.jpg`} alt="profile" className='w-20 h-20 rounded-full object-cover' />
                    </div>

                    <div className='w-full py-2 flex items-center justify-center before:content-["@"] text-sm font-medium'>
                        {user?.userName}
                    </div>

                    <div className='w-full flex items-center justify-center py-4'>
                        <div className='w-24 h-auto flex flex-col items-center justify-center border-r border-gray-300 text-sm'>
                            <span className='font text-lg font-medium'>{followedCount?.value}</span>Takipçiler
                        </div>

                        <div className='w-24 h-auto flex flex-col items-center justify-center text-sm'>
                            <span className='font text-lg font-medium'>{followerCount?.value}</span>Takip edilen
                        </div>
                    </div>

                    <div className='w-full py-2 flex items-center justify-center gap-2'>
                        {userId === myUserId ? <button className='w-40 h-10 rounded-md bg-black text-white text-sm'>Profilimi Düzenle</button> :
                            (followCheck ? <button onClick={() => { mutationFollow.mutate() }} className='w-40 h-10 rounded-md bg-[#7469b6] text-white text-sm'>Takibi Bırak</button> :
                                <button onClick={() => { mutationFollow.mutate() }} className='w-40 h-10 rounded-md bg-[#7469b6] text-white text-sm'>Takip Et</button>)
                        }
                        <button className='w-10 h-10 rounded-md bg-black text-white text-sm'><i class="fa-regular fa-envelope"></i></button>
                    </div>
                </div>

                <div className='w-full h-auto flex flex-col rounded-lg bg-white py-4'>
                    <div className='w-full flex items-center justify-end px-4'><i class="fa-solid fa-pen text-xs w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center cursor-pointer"></i></div>
                    <div className='w-full py-2 px-6 text-[15px]'>
                        {user?.biography}
                    </div>
                </div>
            </div>

            <div className='w-2/3 pt-10 flex flex-col items-center'>
                <div className='w-11/12 h-16 flex gap-4 *:px-6 *:h-8 *:rounded-full *:text-xs *:font-medium'>
                    <button className={activeTab === 'stories' ? 'bg-[#7469b6] text-white' : 'bg-white'}
                        onClick={() => setActiveTab('stories')}>Hikayeler</button>
                    {user?.interactionEnabled ? <button className={activeTab === 'interactions' ? 'bg-[#7469b6] text-white' : 'bg-white'} onClick={() => setActiveTab('interactions')}>Etkileşimler</button> : null}
                </div>
                {activeTab === 'stories' ? posts?.map((post) => (
                    <PostView key={post.id} post={post} />
                )) : interactions?.map((int, index) => (
                    <div key={index} className='w-11/12 py-4 bg-white rounded-lg mb-4 flex items-center'>
                        <div className='px-6 flex items-center justify-center'><i class={`fa-solid ${int.type === 'LIKE' ? 'fa-heart text-red-500' : 'fa-comment text-blue-500'}`}></i></div>
                        <div className='flex items-center'>
                            <a className='mr-1 font-semibold' href={`/story/${int.storyId}`}>{int.storyTitle}</a>
                            <span className='font-light text-sm'>{` adlı hikaye ${int.type === 'LIKE' ? 'beğenildi' : 'için yorum yapıldı'}.`}</span>
                        </div>
                        <div className='flex-1 h-full'></div>
                        <div className='h-full px-8 text-sm flex items-center font-medium'>{formatDate(int.time)}</div>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default Followers