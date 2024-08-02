import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
const apiUrl = process.env.REACT_APP_API_URL;
function CommentReply({ reply, replyUserId }) {

    const userPhotoQuery = useQuery({
        queryKey: ["userPhoto", replyUserId],
        queryFn: () => axios.get(`${apiUrl}/users/getUserProfilePhotos/${replyUserId}`).then(res => res.data)
    });

    const userPhoto = userPhotoQuery.data;

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

    return (
        <div key={reply.id} className='w-full px-4 py-2 bg-gray-100 rounded-lg mb-2'>
            <div className='w-full flex items-center'>
                <div className='w-1/12 h-8 flex items-center justify-center'>
                    <img src={`${apiUrl}/uploads/${userPhoto}`} alt="profile pht" className='w-6 h-6 rounded-full' />
                </div>
                <div className='flex-1 h-8 font-semibold text-xs flex items-center'>@{reply.user.userName}</div>
                <div className='px-2 h-8 font-medium text-xs flex items-center'>{formatDate(reply.replyTime)}</div>
            </div>
            <div className='w-full px-8 font-light text-xs'>{reply.replyText}</div>
        </div>
    )
}

export default CommentReply