import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Comment from '../components/Comment';
import SocialShare from '../components/SocialShare';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
const apiUrl = process.env.REACT_APP_API_URL;
function StoryView() {

  const { storyId } = useParams();
  const userId = localStorage.getItem('storyUserId');

  const [comment, setComment] = useState({
    commentId: '',
    userId: userId,
    storyId: storyId,
    commentText: ''
  });

  const handleChangeComment = (e) => {
    const { name, value } = e.target;
    setComment(prevComment => ({
      ...prevComment,
      [name]: value
    }));
  };

  const mutation = useMutation({
    mutationFn: () => {
      return axios.post(`${apiUrl}/stories/readCount`, { storyId: storyId })
    },
  })





  const { data: story, isLoading: storyLoading, error: storyError, isSuccess: storyIsSuccess } = useQuery({
    queryKey: ["story"],
    queryFn: () => axios.get(`${apiUrl}/stories/${storyId}`).then(res => res.data),
  });

  useEffect(() => {
    if (storyIsSuccess) {
      const timeout = setTimeout(() => {
        mutation.mutate();
      }, (story.wordCount / 3) * 1000);

      return () => clearTimeout(timeout);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyIsSuccess]);

  const mutation2 = useMutation({
    mutationFn: () => {
      if (likeCheck) {
        return axios.delete(`${apiUrl}/likes/delete`, { data: { storyId: storyId, userId: userId } });
      } else {
        return axios.post(`${apiUrl}/likes`, { userId: userId, storyId: storyId });
      }
    },
    onSuccess: () => {
      likeCheckQuery.refetch();
    },
  });

  const likeCheckQuery = useQuery({
    queryKey: ["likeCheck", userId, storyId],
    queryFn: () => axios.get(`${apiUrl}/likes/check/${userId}/${storyId}`).then(res => res.data),
  });

  const fetchComments = async ({ pageParam }) => {
    const response = await axios.get(`${apiUrl}/comments/gett?storyId=${storyId}&page=${pageParam}&size=5`);
    return response.data;
  };

  const commentInfiniteQuery = useInfiniteQuery({
    queryKey: ['comments'],
    queryFn: fetchComments,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,

  });

  const mutationComment = useMutation({
    mutationFn: () => {
      return axios.post(`${apiUrl}/comments`, comment)
    },
    onSuccess: () => {
      commentInfiniteQuery.refetch();
      setComment(prevComment => ({
        ...prevComment,
        commentText: ""
      }));
    }
  })

  const fetchNextPage = commentInfiniteQuery.fetchNextPage;
  const hasNextPage = commentInfiniteQuery.hasNextPage;
  const isFetchingNextPage = commentInfiniteQuery.isFetchingNextPage;
  const comm = commentInfiniteQuery.data
  const likeCheck = likeCheckQuery.data;
  const commentCount = comm?.pages[0]?.commentCount;

  if (storyLoading) return <div>Loading...</div>;
  if (storyError) return <div>Error: {storyError.message}</div>;

  return (
    <div className='w-full h-auto flex flex-col items-center bg-[#eeeff0]'>
      <Navbar progressBar={true} />
      <div className='w-full flex h-auto pb-20'>
        <div className='w-1/4 h-auto'></div>
        <div className='w-2/4 h-auto'>
          <div className='w-full h-32 flex items-end pb-8 justify-center text-3xl font-semibold mt-16'>
            {story.storyTitle}
          </div>
          <div className='w-full pb-6 flex items-center justify-center *:text-black border-b border-black/10'>
            <div className='flex *:px-2 py-2 *:flex *:items-center *:justify-center'>
              <div> <i className="fa-regular fa-eye"></i></div>
              <div>{story.readCount}</div>
            </div>

            <div className='flex *:px-2 py-2 *:flex *:items-center *:justify-center'>
              <div> <i className="fa-regular fa-heart"></i></div>
              <div>{story.likeCount}</div>
            </div>

            <div className='flex *:px-2 py-2 *:flex *:items-center *:justify-center'>
              <div> <i className="fa-regular fa-comment"></i></div>
              <div>{commentCount}</div>
            </div>
          </div>
          <div className='ql-editor'>
            <ReactQuill
              value={story.storyText}
              readOnly={true}
              theme={"bubble"}
            />
          </div>
          <div className='w-full h-16 border-b border-gray-300 flex items-center'>
            <div onClick={() => mutation2.mutate()} className='w-auto h-16 flex items-center justify-center cursor-pointer'>

              <i className={likeCheck ? 'fa-solid fa-heart text-red-500 heart-icon text-lg' : 'fa-regular fa-heart text-black text-lg'}></i>

            </div>
            <div className='px-4 h-16 flex items-center justify-center text-sm'>{likeCheck ? 'Beğendin!' : 'Hikayeyi Beğen'}</div>
            <div className='w-auto flex-1 h-16 flex items-center justify-end'>
              <SocialShare storyLink={`http://localhost:3000/story/${story.id}`} storyTitle={story.storyTitle} />
            </div>
          </div>

          <div className='w-full py-6 flex items-center justify-center'>
            <div className="w-full h-12 rounded-full border border-black/40 hover:border-black flex p-1 items-center">
              <input
                type='text'
                className='flex-1 px-4 font-light text-sm h-full border bg-[#eeeff0] border-gray-300 border-none outline-none rounded-full'
                placeholder='Bir yorum yazın...'
                value={comment.commentText}
                name='commentText'
                onChange={handleChangeComment}
                autoComplete="off"
              />
              <button onClick={() => { mutationComment.mutate() }} className='w-10 h-10 bg-[#B6C7AA] rounded-full text-xs'><i class="fa-regular fa-paper-plane"></i></button>
            </div>
          </div>


          <div className='w-full h-auto flex flex-col items-center gap-4'>
            {comm?.pages.map((page, pageIndex) => (
              <div className='w-full flex flex-col gap-4 items-center' key={pageIndex}>
                {page.data.map(comment => (
                  <Comment comment={comment} userId={userId} storyWriterId={story.user.id} />
                ))}
              </div>
            ))}

            <button
              className={`w-full h-12 bg-[#7469b6] rounded-full text-sm text-white ${hasNextPage ? null : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? 'Yükleniyor...'
                : hasNextPage
                  ? 'Daha fazla yükle'
                  : 'Tüm yorumlar yüklendi'}
            </button>

          </div>
        </div>
        <div className='w-1/4 h-auto'></div>



        {/* <button  className='w-40 h-16 bg-gray-300'>{likeCheck ? "beğeniyi kaldır" : "beğen"}</button> */}
      </div>
    </div>
  )
}

export default StoryView;
