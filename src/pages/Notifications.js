import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import Navbar from '../components/Navbar';
const apiUrl = process.env.REACT_APP_API_URL;
function Notifications() {

    const myUserId = localStorage.getItem('storyUserId');

    const notificationsQuery = useQuery({
        queryKey: ["notifications", myUserId],
        queryFn: () => axios.get(`${apiUrl}/notifications/getUserNotify/${myUserId}`).then(res => res.data)
    });

    const notifications = notificationsQuery.data;

    const renderNotificationMessage = (notify) => {
        switch (notify?.notifyType) {
            case 1:
                return (<p className=' text-black/70'><span className='font-semibold text-black'>{notify.reporting.userName}</span> adlı kullanıcı sizi takip etmeye başladı.</p>)
            case 2:
                return (<p className=' text-black/70'><span className='font-semibold text-black'>{notify.reporting.userName}</span> adlı kullanıcı <span className='font-semibold text-black'>{notify.story.storyTitle}</span> adlı hikayenizi beğendi.</p>)
            case 3:
                return `${notify.reporting.userName} adlı kullanıcı ${notify.story.storyTitle} adlı hikayeye yorum yaptı.`;
            case 4:
                return `${notify.reporting.userName} adlı kullanıcı ${notify.story.storyTitle} adlı hikayeyi okuma listesine ekledi.`;
            case 5:
                return `${notify.reporting.userName} adlı kullanıcı ${notify.story.storyTitle} adlı hikayedeki yorumunuza yanıt verdi.`;
            default:
                return 'Bilinmeyen bildirim';
        }
    };

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
        <div className='w-full h-auto min-h-screen flex bg-white pt-24'>
            <Navbar />
            <div className='w-full h-auto flex flex-col px-8 gap-2'>
                <div className='w-full py-2 font-bold text-2xl'>Bildirimler</div>
                {notifications?.map((notify) => (
                    <div className={`w-10/12 py-2 px-4 shadow bg-white border rounded-e-lg cursor-pointer hover:shadow-md rounded-s-lg`} key={notify.id}>
                        <div className='w-full flex py-2'>
                            <div className='px-4 h-auto'>
                                <img
                                    src={notify.reporting.profileImage ? `${apiUrl}/uploads/${notify.reporting.profileImage}` : '/user.jpg'}
                                    alt="profile"
                                    className='w-8 h-8 rounded-full object-cover' />
                            </div>
                            <div className='flex-1 flex items-center'>{renderNotificationMessage(notify)}</div>
                            <div className='px-4 h-auto text-xs font-semibold'>
                                <i class="fa-regular fa-clock px-2"></i>
                                <span>{formatDate(notify.notifyTime)}</span>
                            </div>
                        </div>

                        {notify.notifyData ? (
                            <div className='w-full py-2 px-4 bg-[#eeeff0] rounded-md text-sm'>"{notify.notifyData}"</div>
                        ) : null}
                    </div>
                ))}</div>
        </div>
    )
}

export default Notifications