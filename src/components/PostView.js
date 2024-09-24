import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import "./button.css"
import sanitize from "sanitize-html";
import categories from "./Categories";

export default function PostView({ post, isProfile }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const myUserId = localStorage.getItem('storyUserId');
  const [showMenu, setShowMenu] = useState({});
  const [deleteMenu, setDeleteMenu] = useState(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", post.user.id],
    queryFn: () =>
      axios
        .get(`${apiUrl}/users/${post.user.id}`)
        .then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (storyId) => {
      if (saveCheck) {
        return axios.delete(`${apiUrl}/savedstory/delete`, { data: { storyId: storyId, userId: myUserId } });
      } else {
        return axios.post(`${apiUrl}/savedstory`, { storyId: storyId, userId: myUserId });
      }
    },
    onSuccess: () => {
      saveCheckQuery.refetch();
      savedCountQuery.refetch();
    },
  });

  const mutationDeleteStory = useMutation({
    mutationFn: (storyId) => {
      return axios.delete(`${apiUrl}/stories/${storyId}`);
    },
    onSuccess: () => {
      setDeleteMenu(false)
    },
  });

  const saveCheckQuery = useQuery({
    queryKey: ["saveCheck", myUserId, post.id],
    queryFn: () => axios.get(`${apiUrl}/savedstory/check/${myUserId}/${post.id}`).then(res => res.data),
  });

  const savedCountQuery = useQuery({
    queryKey: ["savedCount", post.id],
    queryFn: () => axios.get(`${apiUrl}/savedstory/getCount/${post.id}`).then(res => res.data),
  });

  const getCategoryNameById = (id) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.categoryName : 'Kategori seç';
  };

  const clean = sanitize(post?.storyText);
  const saveCheck = saveCheckQuery.data;
  const savedCount = savedCountQuery.data;

  const toggleMenu = (postId) => {
    setShowMenu((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        toggleMenu(post.id);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [post.id, menuRef]);

  if (isLoading) return <div className="w-11/12 h-64 bg-slate-300 mt-6 rounded-lg pt-4 px-4"></div>
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-11/12 h-auto bg-white mb-6 rounded-lg pt-4 px-4">
      <div className="w-full h-10 flex">
        <div className="w-12 h-12 flex items-center justify-center">
          <img
            src={data && data.profileImage ? `${apiUrl}/uploads/${data.profileImage}` : '/user.jpg'}
            alt="resim"
            className="w-8 h-8 rounded-full object-cover" />
        </div>
        <div className="h-12 w-auto flex items-center font-semibold text-black text-sm font-sans">
          {" "}
          {"@" + data.userName}
        </div>
        <div className="flex-1"></div>
        {isProfile && post.user.id === myUserId ? <div onClick={() => toggleMenu(post.id)} ref={buttonRef} className="h-12 w-auto flex items-center justify-center cursor-pointer px-10 relative">
          <i class="fa-solid fa-ellipsis"></i>
          {showMenu[post.id] && (
            <div ref={menuRef} className='w-48 h-auto py-2 shadow-lg bg-white rounded-lg flex flex-col z-10 absolute -bottom-16'>
              <button onClick={() => setDeleteMenu(post.id)} className='w-full h-7 flex items-center px-4 text-xs font-medium hover:bg-red-200 hover:text-red-800'>Hikayeyi sil</button>
              <a href={`/create/${post.id}`}>
                <button className='w-full h-7 hover:bg-gray-100 flex items-center px-4 text-xs font-medium'>Hikayeyi düzenle</button>
              </a>
            </div>
          )}
        </div> : null}
      </div>
      <div className="w-full h-12 font-bold text-xl px-12 flex items-center truncate select-none">
        {post.storyTitle} <a href={`/category/${post.category}`} className="px-4 ml-2 rounded-full bg-black text-white text-[11px] font-medium">{getCategoryNameById(post.category)}</a>
      </div>
      <div className="w-full h-36 font-normal text-sm px-12 text-gray-800 text-ellipsis overflow-hidden select-none" dangerouslySetInnerHTML={{ __html: clean }}>

      </div>

      <div className="w-full h-8 flex items-end pl-12">
        {post?.tags?.map((tag, index) => (
          <a href={`/tag/${tag}`} className="w-auto h-6 px-4 mr-2 rounded-full bg-gray-200 text-xs cursor-pointer flex items-center justify-center" key={index}>{tag}</a>
        ))}
      </div>

      <div className="w-full h-16 flex px-12">
        <div className="px-2 h-16 flex">
          <div
            className="w-8 h-16 flex items-center justify-center cursor-pointer">
            <i className="fa-regular fa-eye text-black text-lg"></i>
          </div>
          <div className="w-auto h-16 text-sm text-black font-bold flex items-center justify-center select-none">
            {post.readCount}
          </div>
        </div>

        <div className="px-2 h-16 flex">
          <div
            className="w-8 h-16 flex items-center justify-center cursor-pointer">
            <i className='fa-solid fa-heart text-red-600 text-lg'></i>
          </div>
          <div className="w-auto h-16 text-sm text-black font-bold flex items-center justify-center select-none">
            {post.likeCount}
          </div>
        </div>

        <div className="flex-1 h-16"></div>
        <div className="w-1/2 h-16 flex justify-end">
          <div className="w-28 h-16 flex items-center justify-center">
            <a href={`/story/${post.id}`}>
              <button className="px-4 py-2 bg-[#070608] text-white rounded-full text-xs">Devamını Oku</button>
            </a>
          </div>
          <div
            onClick={() => mutation.mutate(post.id)}
            className="w-8 h-16 flex items-center justify-center cursor-pointer">
            <i className={saveCheck ? 'fa-solid fa-circle-plus text-red-500 text-lg' : 'fa-solid fa-circle-plus text-black text-lg'}></i>
          </div>
          <div className="w-auto h-16 text-sm text-black font-bold flex items-center justify-center select-none">
            {savedCount}
          </div>
        </div>
        {deleteMenu === post.id ? (
          <div className="w-full h-screen bg-black/50 fixed top-0 left-0 z-50 flex items-center justify-center">
            <div className="w-96 py-4 bg-white rounded-md">
              <div className="text-sm font-medium text-center">
                Bu hikayeyi silmek istediğinize emin misiniz? <br /> Bu işlem geri alınamaz.
              </div>
              <div className="flex items-center justify-around pt-4 px-8 *:text-xs *:text-white *:rounded-md">
                <button onClick={() => mutationDeleteStory.mutate(post.id)} className="w-36 h-10 bg-[#7469b6]">Evet</button>
                <button onClick={() => setDeleteMenu(null)} className="w-36 h-10 bg-black">İptal</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
