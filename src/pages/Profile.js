import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import PostView from '../components/PostView';
import Navbar from '../components/Navbar';
import sanitize from 'sanitize-html';
const apiUrl = process.env.REACT_APP_API_URL;
function Profile() {

    const { userId } = useParams();
    const myUserId = localStorage.getItem('storyUserId');
    const [activeTab, setActiveTab] = useState("stories")
    const [followDiv, setFollowDiv] = useState({
        value: false,
        name: 'followers'
    })


    const fileInputRef = useRef(null);
    const userQuery = useQuery({
        queryKey: ["user", userId],
        queryFn: () => axios.get(`${apiUrl}/users/${userId}`).then(res => res.data)
    });

    const user = userQuery.data;

    // const { data: follower, isLoading: followerLoading, error: followerError } = useQuery({
    //     queryKey: ["follower", userId],
    //     queryFn: () => axios.get(`${apiUrl}/follows/follower/${userId}`).then(res => res.data)
    // });


    const followerCountQuery = useQuery({
        queryKey: ["followerCount", userId],
        queryFn: () => axios.get(`${apiUrl}/follows/followerCount/${userId}`).then(res => res.data)
    });

    const followerCount = followerCountQuery.data;

    const followedCountQuery = useQuery({
        queryKey: ["followedCount", userId],
        queryFn: () => axios.get(`${apiUrl}/follows/followedCount/${userId}`).then(res => res.data)
    });

    const followedCount = followedCountQuery.data;

    const postsQuery = useQuery({
        queryKey: ["stories", userId],
        queryFn: () => axios.get(`${apiUrl}/stories/getUserStoryIsPublish/${userId}`).then(res => res.data)
    });

    const posts = postsQuery.data;

    const draftsQuery = useQuery({
        queryKey: ["drafts", userId],
        queryFn: () => axios.get(`${apiUrl}/stories/getUserStoryIsDraft/${userId}`).then(res => res.data)
    });

    const drafts = draftsQuery.data;

    const followCheckQuery = useQuery({
        queryKey: ["followCheck", myUserId, userId],
        queryFn: () => axios.get(`${apiUrl}/follows/followCheck/${myUserId}/${userId}`).then(res => res.data)
    });

    const followCheck = followCheckQuery.data;

    const interactionsQuery = useQuery({
        queryKey: ["interactions", userId],
        queryFn: () => axios.get(`${apiUrl}/users/getUserInteractions/${userId}`).then(res => res.data)
    });

    const interactions = interactionsQuery.data;

    const followersQuery = useQuery({
        queryKey: [followDiv.name === "followers" ? "followers" : "following", userId],
        queryFn: () => {
            if (followDiv.name === "followers") {
                return axios.get(`${apiUrl}/follows/followed/${userId}/${myUserId}`).then(res => res.data);
            } else {
                return axios.get(`${apiUrl}/follows/follower/${userId}/${myUserId}`).then(res => res.data);
            }
        },
        enabled: followDiv.value
    });

    const followers = followersQuery.data;

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

    const badgeFunc = (badgeValue) => {
        switch (badgeValue) {
            case 1:
                return "Yönetici";
            case 2:
                return "Baş Editör";
            default:
                return "Kullanıcı";
        }
    }

    const mutationFollow = useMutation({
        mutationFn: ({ myUserId, userId, followCheck }) => {
            if (followCheck) {
                return axios.delete(`${apiUrl}/follows/unfollow`, { data: { followerId: myUserId, followedId: userId } });
            } else {
                return axios.post(`${apiUrl}/follows?followerId=${myUserId}&followedId=${userId}&size=5`)
            }
        },
        onSuccess: () => {
            followersQuery.refetch();
            followedCountQuery.refetch();
            followCheckQuery.refetch();
        }
    })

    const showFollowersFunc = (name, value) => {
        setFollowDiv({
            name: name,
            value: value
        });
    };

    const mutationPhoto = useMutation({
        mutationFn: (formData) => {
        return axios.post(`${apiUrl}/users/uploadProfilePicture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }});

    const biography = sanitize(user?.biography);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', userId);

            mutationPhoto.mutate(formData, {
                onSuccess: (response) => {
                    console.log('Dosya yüklendi:', response.data);
                    alert('Dosya başarıyla yüklendi!');
                },
                onError: (error) => {
                    console.error('Dosya yükleme hatası:', error.response ? error.response.data : error.message);
                    alert('Dosya yükleme hatası: ' + (error.response ? error.response.data : error.message));
                },
            });
        }
    };

    const handleProfileClick = () => {
        fileInputRef.current.click();
    };


    return (
        <div className='w-full h-auto min-h-screen flex bg-[#eeeff0] pt-16'>
            <Navbar />
            <div className='w-1/3 h-auto pl-28 pt-10 flex flex-col gap-2'>
                <div className='w-full h-auto flex flex-col rounded-lg bg-white py-4'>
                    <div className='w-full py-2 flex items-center justify-center'>
                        <div onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                            <img
                                src={`${apiUrl}/uploads/${user?.profileImage}`}
                                alt="Profile"
                                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                            />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileChange}
                        />
                    </div>
                    {/* <div className='w-full py-2 flex items-center justify-center'>
                        <input type="file"
                            id="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            required />
                        <img src={`${apiUrl}/uploads/${userId}.jpg`} alt="profile" className='w-20 h-20 rounded-full object-cover' />
                    </div> */}

                    <div className='w-full py-2 flex items-center justify-center before:content-["@"] text-sm font-medium'>
                        {user?.userName}
                    </div>

                    {user?.badge === 0 ? null : <div className='w-full flex items-center justify-center'>
                        <div className='px-4 rounded-full py-1 bg-[#7469b6] text-xs text-white font-semibold'>
                            {badgeFunc(user?.badge)}
                        </div>
                    </div>}

                    <div className='w-full flex items-center justify-center py-4'>
                        <div className='w-24 h-auto flex flex-col items-center justify-center border-r border-gray-300 text-sm'>
                            <button onClick={() => showFollowersFunc('followers', true)} className='font text-lg font-medium px-4'>{followedCount?.value}</button>Takipçiler
                        </div>

                        <div className='w-24 h-auto flex flex-col items-center justify-center text-sm'>
                            <button onClick={() => showFollowersFunc('following', true)} className='font text-lg font-medium px-4'>{followerCount?.value}</button>Takip edilen
                        </div>
                    </div>

                    <div className='w-full py-2 flex items-center justify-center gap-2'>
                        {userId === myUserId ? <button className='w-40 h-10 rounded-md bg-black text-white text-sm'>Profilimi Düzenle</button> :
                            (followCheck ? <button onClick={() => { mutationFollow.mutate({ myUserId, userId, followCheck }) }} className='w-40 h-10 rounded-md bg-[#7469b6] text-white text-sm'>Takibi Bırak</button> :
                                <button onClick={() => { mutationFollow.mutate({ myUserId, userId, followCheck }) }} className='w-40 h-10 rounded-md bg-[#7469b6] text-white text-sm'>Takip Et</button>)
                        }
                        <button className='w-10 h-10 rounded-md bg-black text-white text-sm'><i class="fa-regular fa-envelope"></i></button>
                    </div>
                </div>

                <div className='w-full h-auto flex flex-col rounded-lg bg-white py-4 sticky top-20'>
                    <div className='w-full py-2 px-6 text-[15px]' dangerouslySetInnerHTML={{ __html: biography }}></div>
                    <div className='w-full py-2 px-6 text-[15px]'>
                        <a href={user?.website} className='py-2 flex items-center gap-2'><i class="fa-solid fa-paperclip text-[#4169e1]"></i>
                            <span className='hover:underline text-black/80 font-medium'>
                                {user?.website}
                            </span>
                        </a>
                    </div>

                </div>
            </div>

            <div className='w-2/3 pt-10 flex flex-col items-center'>
                <div className='w-11/12 h-16 flex gap-4 *:px-6 *:h-8 *:rounded-full *:text-xs *:font-medium'>
                    <button className={activeTab === 'stories' ? 'bg-[#7469b6] text-white' : 'bg-white'}
                        onClick={() => setActiveTab('stories')}>Hikayeler</button>
                    {userId === myUserId ? <button className={activeTab === 'drafts' ? 'bg-[#7469b6] text-white' : 'bg-white'}
                        onClick={() => setActiveTab('drafts')}>Taslaklar</button> : null}
                    {user?.interactionEnabled ? <button className={activeTab === 'interactions' ? 'bg-[#7469b6] text-white' : 'bg-white'} onClick={() => setActiveTab('interactions')}>Etkileşimler</button> : null}
                </div>
                {activeTab === 'stories' ? posts?.map((post) => (
                    <PostView key={post.id} post={post} />
                )) : null}
                {activeTab === 'drafts' ? (
                    drafts?.map((post) => (
                        <PostView key={post.id} post={post} />
                    ))
                ) : null}
                {activeTab === 'interactions' ? interactions?.map((int, index) => (
                    <div key={index} className='w-11/12 py-4 bg-white rounded-lg mb-4 flex items-center'>
                        <div className='px-6 flex items-center justify-center'><i class={`fa-solid ${int.type === 'LIKE' ? 'fa-heart text-red-500' : 'fa-comment text-blue-500'}`}></i></div>
                        <div className='flex items-center'>
                            <a className='mr-1 font-semibold' href={`/story/${int.storyId}`}>{int.storyTitle}</a>
                            <span className='font-light text-sm'>{` adlı hikaye ${int.type === 'LIKE' ? 'beğenildi' : 'için yorum yapıldı'}.`}</span>
                        </div>
                        <div className='flex-1 h-full'></div>
                        <div className='h-full px-8 text-sm flex items-center font-medium'>{formatDate(int.time)}</div>
                    </div>
                )) : null}
            </div>
            {followDiv.value ? <div className='fixed w-full h-screen top-0 left-0 bg-black/40 flex items-center justify-center'>
                <div className='w-1/3 h-3/4 bg-white rounded-lg p-6'>
                    <div className='w-full h-12 px-4 flex justify-end'>
                        <button onClick={() => showFollowersFunc(null, false)} className='w-8 h-8 bg-gray-200 hover:bg-red-600 duration-300 hover:text-white flex items-center justify-center text-xs rounded-full'>
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className='w-full h-96 overflow-y-auto'>
                        {followers?.map((follower) => (
                            <div key={follower.followerId} className='w-full h-12 flex'>
                                <div className='w-16 h-12 flex items-center justify-center'>
                                    <img
                                        src={followDiv.name === 'followers' ? `${apiUrl}/uploads/${follower.followerId}.jpg` : `${apiUrl}/uploads/${follower.followedId}.jpg`}
                                        alt="resim"
                                        className="w-8 h-8 rounded-full"
                                    />
                                </div>
                                <div className='flex-1 flex flex-col h-12'>
                                    <div className='w-44 h-6 flex items-end text-sm font-semibold'>{follower.fullName}</div>
                                    <div className='w-44 h-6 flex items-start font-medium text-xs text-gray-700 truncate'>{'@' + follower.userName}</div>
                                </div>
                                <div className='px-4 justify-center items-center'>
                                    {followDiv.name === "followers" && follower.followerId === myUserId ? null : (followDiv.name === "following" && follower.followedId === myUserId ? null : (follower.isFollowing ? (followDiv.name === 'followers' ? <button onClick={() => { mutationFollow.mutate({ myUserId, userId: follower.followerId, followCheck: follower.isFollowing }) }} className='px-4 py-2 rounded-full text-xs bg-[#7469b6] text-white'>Takibi bırak</button>
                                        :
                                        <button onClick={() => { mutationFollow.mutate({ myUserId, userId: follower.followedId, followCheck: follower.isFollowing }) }} className='px-4 py-2 rounded-full text-xs bg-[#7469b6] text-white'>Takibi bırak</button>)
                                        :
                                        <button onClick={() => { mutationFollow.mutate({ myUserId, userId: follower.followerId, followCheck: follower.isFollowing }) }} className='px-4 py-2 rounded-full text-xs bg-black hover:bg-gray-800 duration-300 text-white'>Takip Et</button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div> : null}
        </div>

    )
}

export default Profile