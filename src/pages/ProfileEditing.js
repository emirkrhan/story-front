import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const apiUrl = process.env.REACT_APP_API_URL;

function ProfileEditing() {

  const { userId } = useParams();
  const navigate = useNavigate();

  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => axios.get(`${apiUrl}/users/${userId}`).then(res => res.data)
  });

  const user = userQuery.data;
  const userSuccess = userQuery.isSuccess;

  const [editProfile, setEditProfile] = useState({
    userName: "",
    biography: "",
    website: "",
    interactionEnabled: false
  });
  useEffect(() => {
    if (userSuccess && user) {
      setEditProfile({
        userName: user.userName,
        biography: user.biography,
        website: user.website,
        interactionEnabled: user.interactionEnabled
      });
    }
  }, [user, userSuccess]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditProfile(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleChangeBiography = (value) => {
    setEditProfile(prevEditProfile => ({
      ...prevEditProfile,
      biography: value
    }));
  };

  const mutation = useMutation({
    mutationFn: () => {
      return axios.put(`${apiUrl}/users/${userId}`, editProfile)
    },
    onSuccess: () => {
      navigate(`/user/${userId}`)
    }
  });

  return (
    <div className='w-full h-auto min-h-screen flex bg-[#eeeff0] pt-32 px-40'>
      <Navbar />
      <div className='w-full h-auto'>
        <div className='w-60 py-2'>
          <label htmlFor="UserName" className="block text-sm font-medium text-gray-700"> Kullanıcı Adı </label>
          <input
            name="userName"
            value={editProfile.userName}
            id='userName'
            onChange={handleChange}
            type="text"
            placeholder="username"
            className="mt-2 h-10 px-4 w-full outline-none rounded-md shadow-sm text-sm"
          />
        </div>
        <div className='w-1/2 py-2'>
          <label htmlFor="UserName" className="block text-sm font-medium text-gray-700"> Hakkımda </label>
          {/* <textarea
            
            rows={8}
            className='mt-2 '
          /> */}
          <div className='h-40 px-4 w-full bg-white outline-none rounded-md shadow-sm text-sm overflow-y-scroll'>

            <ReactQuill
              theme="snow"
              name="biography"
              value={editProfile.biography}
              onChange={handleChangeBiography}
              id='biography'
              on
            />
          </div>

        </div>
        <div className='w-1/2 py-2'>
          <label htmlFor="UserName" className="block text-sm font-medium text-gray-700"> Kişisel Websitesi </label>
          <input
            type="text"
            name="website"
            value={editProfile.website}
            onChange={handleChange}
            id='website'
            placeholder="www.fableshot.com"
            className='mt-2 h-10 px-4 w-full outline-none rounded-md shadow-sm text-sm'
          />

        </div>

        <div className='w-1/2 py-2 flex'>
          <label htmlFor="UserName" className="block text-sm font-medium text-gray-700"> Etkileşimler Sekmesi </label>
          <div className='flex-1'></div>


          <label
            htmlFor="interactionEnabled"
            className="relative inline-block h-6 w-12 cursor-pointer rounded-full bg-gray-300 transition-colors has-[:checked]:bg-[#7469b6]"
          >
            <input
              type="checkbox"
              name="interactionEnabled"
              checked={editProfile.interactionEnabled}
              onChange={handleChange}
              id='interactionEnabled'
              className="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
            />
            <span
              className="absolute inset-y-0 left-0 z-10 m-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:left-6 peer-checked:text-[#7469b6]"
            >
              <svg
                data-unchecked-icon
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                data-checked-icon
                xmlns="http://www.w3.org/2000/svg"
                className="hidden h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </label>

        </div>
        <div className='w-auto gap-2 py-2 flex'>
          <button onClick={() => mutation.mutate()} className='w-40 h-10 bg-[#7469b6] text-white rounded-md text-sm'>Kaydet</button>
          <a href={`/user/${userId}`} className='w-28 h-10 bg-black text-white rounded-md text-sm flex items-center justify-center'>İptal</a>
        </div>
      </div>
    </div>
  )
}

export default ProfileEditing