import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import CommentReply from './CommentReply';

function Comment({ comment, userId, storyWriterId, commentQuery, storyId }) {

    const apiUrl = process.env.REACT_APP_API_URL;
    const commentId = comment.id;
    const menuRef = useRef(null);
    const buttonRef = useRef(null);


    const [showReplies, setShowReplies] = useState({});
    const [showMenu, setShowMenu] = useState({});
    const [commentReply, setCommentReply] = useState({
        commentReplyId: '',
        userId: userId,
        replyText: ''
    });

    const mutationNotification = useMutation({
        mutationFn: (obj) => {
          return axios.post(`${apiUrl}/notifications/createNotification/${userId}`, obj)
        },
      })

    const handleReplyCommentChange = (e) => {
        const { name, value } = e.target;
        setCommentReply(prevCommentReply => ({
            ...prevCommentReply,
            [name]: value
        }));
    };

    const toggleReplies = (commentId) => {
        setShowReplies((prev) => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const toggleMenu = (commentId) => {
        setShowMenu((prev) => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
                toggleMenu(comment.id);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [comment.id, menuRef]);

    const [replyFormVisible, setReplyFormVisible] = useState({});

    const openReplyForm = (commentId) => {
        setReplyFormVisible((prev) => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const mutationReplyComment = useMutation({
        mutationFn: (commentId) => {
            return axios.post(`${apiUrl}/commentsreply/${commentId}`, commentReply)
        },
        onSuccess: () => {
            mutationNotification.mutate({ notifierId: storyWriterId, storyId: storyId, notifyType: 3, notifyData: commentReply.replyText });
            mutationNotification.mutate({ notifierId: comment.user.id, storyId: storyId, notifyType: 5, notifyData: commentReply.replyText });
            commentReplyInfiniteQuery.refetch();
            setCommentReply(prevCommentReply => ({
                ...prevCommentReply,
                replyText: ""
            }));
        }
    })

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

    const fetchCommentReply = async ({ pageParam }) => {

        const response = await axios.get(`${apiUrl}/comments/gett/commentReply?commentId=${commentId}&page=${pageParam}&size=3`);
        return response.data;
    };

    const commentReplyInfiniteQuery = useInfiniteQuery({
        queryKey: ['commentReply', comment.id],
        queryFn: fetchCommentReply,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    const mutationDeleteComment = useMutation({
        mutationFn: (commentId) => {
            return axios.delete(`${apiUrl}/comments/${commentId}`);
        },
        onSuccess: () => {
            commentQuery.refetch();
        }
    });

    const fetchNextPage = commentReplyInfiniteQuery.fetchNextPage;
    const hasNextPage = commentReplyInfiniteQuery.hasNextPage;
    const isFetchingNextPage = commentReplyInfiniteQuery.isFetchingNextPage;
    const replies = commentReplyInfiniteQuery.data;
    const commentReplyCount = replies?.pages[0]?.commentCount;


    return (
        <div key={comment.id} className='w-full h-auto bg-white rounded-lg'>
            <div className='w-full px-4 flex pt-4'>
                <div className='w-1/12 h-10 flex items-center justify-center'>
                    <a href={`/user/${comment.user.id}`}> <img src={comment.user.profileImage ? `${apiUrl}/uploads/${comment.user.profileImage}` : '/user.jpg'} alt="profile pht" className='w-8 h-8 rounded-full object-cover' /></a>
                </div>
                <div className='flex-1 h-10 font-semibold text-sm flex items-center'>@{comment.user.userName}</div>
                <div className='px-4 h-10 font-medium text-xs flex items-center'>{formatDate(comment.commentTime)}</div>
            </div>
            <div className='w-full px-16 font-light text-sm'>{comment.commentText}

            </div>
            <div className='w-full pr-4 pl-14 text-sm flex items-center gap-2'>
                <button onClick={() => openReplyForm(comment.id)} className='w-8 h-8 rounded-full hover:bg-gray-100'><i className="fa-solid fa-reply"></i></button>
                <div className='flex-1 h-full flex items-center justify-end'>
                    <button className='w-8 h-8 rounded-full hover:bg-gray-100'>
                        <i className="fa-solid fa-circle-info"></i>
                    </button>
                    <button ref={buttonRef} onClick={() => toggleMenu(comment.id)} className={`w-8 h-8 rounded-full hover:bg-gray-100 ${showMenu[comment.id] && 'hover:bg-white'} relative`}>
                        <i className="fa-solid fa-ellipsis z-0"></i>
                        {showMenu[comment.id] && (
                            <div ref={menuRef} className='w-48 h-auto py-2 shadow-lg bg-white rounded-lg flex flex-col z-10 absolute'>
                                {(comment.user.id === userId || storyWriterId === userId) ? <div onClick={() => mutationDeleteComment.mutate(comment.id)} className='w-full h-7 hover:bg-gray-100 flex items-center px-4 text-xs font-medium'>Yorumu sil</div> : null}
                                <div className='w-full h-7 hover:bg-gray-100 flex items-center px-4 text-xs font-medium'>Yorumu şikayet et</div>
                            </div>
                        )}
                    </button>
                </div>
            </div>
            {replyFormVisible[comment.id] && (
                <div className='w-full px-16 h-14 flex justify-center'>
                    <div className='w-full h-10 rounded-full border border-black/30 flex p-1 items-center'>
                        <input
                            type='text'
                            className='flex-1 px-4 font-light text-sm h-full border border-gray-300 border-none outline-none rounded-full'
                            placeholder='Yorumu yanıtla'
                            value={commentReply.replyText}
                            name='replyText'
                            onChange={handleReplyCommentChange}
                        />
                        <button onClick={() => { mutationReplyComment.mutate(comment.id) }} className='w-8 h-8 bg-[#B6C7AA] rounded-full text-xs'><i class="fa-regular fa-paper-plane"></i></button>
                    </div>
                </div>
            )}

            {commentReplyCount > 0 ? (
                <>
                    <button
                        className='w-full px-16 font-semibold text-xs text-[#7469b6] flex items-center pb-4'
                        onClick={() => toggleReplies(comment.id)}
                    >
                        {showReplies[comment.id] ? 'Yanıtları gizle' : 'Tüm yanıtları gör'}
                    </button>
                    {showReplies[comment.id] && (
                        <div className='w-full px-16'>
                            {replies?.pages.map((page, pageIndex) => (
                                <div key={pageIndex}>
                                    {page.dataReply.map((reply) => (
                                        <CommentReply reply={reply} replyUserId={reply.user.id} />
                                    ))}

                                </div>

                            ))}
                            <button
                                className={`w-full flex h-12 text-xs font-bold text-[#7469b6] ${hasNextPage ? null : 'hidden'}`}
                                onClick={() => fetchNextPage()}
                                disabled={!hasNextPage || isFetchingNextPage}
                            >
                                {isFetchingNextPage
                                    ? 'Yükleniyor...'
                                    : hasNextPage
                                        ? 'Daha fazla yanıt yükle'
                                        : ''}
                            </button>
                        </div>
                    )}
                </>
            ) : null}

        </div>
    )
}

export default Comment