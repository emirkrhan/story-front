import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../App.css';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import categories from '../components/Categories';
const apiUrl = process.env.REACT_APP_API_URL;

function WritingStory() {

  const userId = localStorage.getItem('storyUserId');
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [storyInfo, setStoryInfo] = useState(false);
  const [showCategoryInfo, setShowCategoryInfo] = useState(false);
  const [story, setStory] = useState({
    storyId: "",
    userId: userId,
    storyTitle: "Başlıksız bölüm",
    storyText: "",
    wordCount: 0,
    category: 0,
    storyDate: new Date().toISOString(),
    likeCount: 0,
    isPublish: false,
    tags: []
  });

  const { data: fetchStory, isLoading: storyLoading, error: storyError, isSuccess: storyIsSuccess } = useQuery({
    queryKey: ["fetchStory", storyId],
    queryFn: () => axios.get(`${apiUrl}/stories/${storyId}`).then(res => res.data),
    enabled: !!storyId,
  });



  useEffect(() => {
    if (storyIsSuccess && fetchStory) {
      setStory({
        storyId: fetchStory.id,
        userId: "",
        storyTitle: fetchStory.storyTitle,
        storyText: fetchStory.storyText,
        wordCount: "",
        category: fetchStory.category,
        storyDate: "",
        likeCount: "",
        isPublish: fetchStory.isPublish,
        tags: fetchStory.tags
      });
    }
  }, [fetchStory, storyIsSuccess]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setStory(prevStory => ({
      ...prevStory,
      [name]: value
    }));
  };

  const handleChangeText = (value) => {

    setStory(prevStory => ({
      ...prevStory,
      storyText: value
    }));
  };

  useEffect(() => {
    const countWords = (text) => {
      return text.trim().split(/\s+/).filter(Boolean).length;
    };

    const updateWordCount = () => {
      setStory(prevStory => ({
        ...prevStory,
        wordCount: countWords(prevStory.storyText)
      }));

    };

    updateWordCount();
  }, [story.storyText]);

  const handleSaveDraft = () => {
    setStory(prevStory => ({
      ...prevStory,
      isPublish: false
    }));
    console.log(story)
    mutation.mutate({ ...story, isPublish: false });
  };

  const handlePublish = () => {
    setStory(prevStory => ({
      ...prevStory,
      isPublish: true
    }));
    mutation.mutate({ ...story, isPublish: true });
  };

  const mutation = useMutation({
    mutationFn: (updatedStory) => {
      return axios.post(`${apiUrl}/stories/create`, updatedStory)
    },
    onSuccess: (data) => {
      navigate(`/story/${data.data.id}`)
    }
  });

  const handleTagChange = (e) => {
    if (e.key === 'Enter' && e.target.value !== '') {
      e.preventDefault();
      let newTag = e.target.value.trim();
      if (!story.tags.includes(newTag)) {
        setStory(prevStory => ({
          ...prevStory,
          tags: [...prevStory.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setStory(prevStory => ({
      ...prevStory,
      tags: prevStory.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getCategoryNameById = (id) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.categoryName : 'Kategori seç';
  };

  const setCategoryNameById = (id) => {
    setStory(prevStory => ({
      ...prevStory,
      category: id
    }));
  };

  if (storyLoading) return <div>Loading...</div>
  if (storyError) return <div>Error: {storyError.message}</div>;

  return (
    <div className='w-full h-auto min-h-screen flex pt-16'>

      {/* <div className='w-1/4 h-screen bg-[#eeeff0] sticky top-0 flex flex-col'>
        <div className='w-full h-20 flex items-center px-8'>
          <Link to='/'>
            <i class="fa-solid fa-arrow-left"></i>
          </Link>
        </div>

        <div className='w-full h-16 px-10 flex items-center justify-center'>
         
        </div>

        <div className='w-full h-16 flex items-center justify-between px-10 *:w-20 *:h-12 *:bg-white *:rounded-md'>
        </div>

        <div className='w-full h-16 flex items-center justify-between px-10 *:w-14 *:h-12 *:bg-white *:rounded-md'>
          <button><i class="fa-solid fa-align-right"></i></button>
          <button><i class="fa-solid fa-align-center"></i></button>
          <button><i class="fa-solid fa-align-left"></i></button>
          <button><i class="fa-solid fa-align-justify"></i></button>
        </div>

        <div className='w-full h-16 px-10 flex items-center justify-center'>
          <div className='w-full bg-white h-12 rounded-md flex'>
            <div className='w-2/3 h-12 flex items-center justify-center font-medium text-lg'>{story.wordCount}</div>
            <div className='w-1/3 h-12 flex items-center justify-center text-gray-400'>words</div>
          </div>
        </div>

        <div className='w-full h-16 px-10 flex items-center justify-center'>
          <button className='w-full bg-white h-12 rounded-md' onClick={(e) => konsolyaz(e)}>
            Taslağı Kaydet
          </button>
        </div>
      </div> */}

      <div className='w-full h-auto min-h-screen flex flex-col items-center'>
        <div className='w-1/2 h-32 flex items-end justify-center mb-8'>
          <input
            type="text"
            name="storyTitle"
            value={story.storyTitle}
            onChange={handleChange}
            autoComplete="off"
            className='w-full h-auto text-center pb-2 border-b border-gray-400 outline-none text-3xl font-medium'
          />
        </div>

        <div className='w-1/2 h-auto min-h-screen flex items-start justify-center'>
          {/* <textarea
            name="storyText"
            value={story.storyText}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Hikayeni yaz..."
            className='w-10/12 min-h-screen resize-none overflow-hidden outline-none text-lg'
            rows='2'
          /> */}
          {/* <ReactQuill theme="snow" value={story.storyText} onChange={handleChangeText} className='w-full' /> */}
          <ReactQuill
            theme="snow"
            value={story.storyText}
            onChange={handleChangeText}
            on
            className='w-full'
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }]
              ],
            }}
            formats={[
              'bold', 'italic', 'underline',
              'align',
            ]}
          />
        </div>
        <div className='fixed px-8 top-0 w-full h-20 flex gap-2 items-center bg-white z-10 write-box *:text-sm *:font-medium *:rounded-md *:h-10'>
          <div className='px-8 h-full flex items-center justify-center'>
            <a href={`/user/${userId}`} className='w-12 h-12 rounded-full flex hover:bg-gray-100 items-center justify-center'>
              <i class="fa-solid fa-angle-left"></i>
            </a>
          </div>

          <div className='h-20 flex-1'></div>
          <button onClick={() => setStoryInfo(true)} className='w-10 bg-black'>
            <i class="fa-brands fa-readme text-white"></i>
          </button>
          <button className='px-6 bg-black text-white' onClick={handleSaveDraft}>
            Taslağa kaydet
          </button>
          <button className='px-8 bg-[#7469b6] text-white' onClick={handlePublish}>
            Yayımla
          </button>

        </div>
      </div>
      {storyInfo ? <div className='w-full h-full bg-black/50 fixed top-0 left-0 z-50 flex items-center justify-center'>
        <div className='w-96 h-96 bg-white rounded-lg'>
          <div className='w-full h-20 flex items-center justify-center'>
            <button onClick={() => setShowCategoryInfo(!showCategoryInfo)} className='w-80 h-12 rounded-md relative border border-gray-100 bg-white shadow text-sm font-medium text-gray-500 flex items-center justify-between px-4'>
              <p>{getCategoryNameById(story.category)}</p>
              <button><i class="fa-solid fa-angle-down"></i></button>
              {showCategoryInfo ? <div className='w-80 py-4 rounded-md bg-white flex flex-col absolute top-16 shadow-lg  left-0'>
                {categories.map((cat) => (
                  <button onClick={() => setCategoryNameById(cat.id)} className='hover:bg-gray-100 py-1' key={cat.id}>{cat.categoryName}</button>
                ))}
              </div> : null}
            </button>

          </div>
          <div className='w-full h-16 flex items-center justify-center'>
            <input
              type="text"
              onKeyDown={handleTagChange}
              placeholder="Etiket ekle ve enter'a bas"
              className='w-80 h-12 rounded-md border focus:border-gray-500 outline-none border-gray-100 bg-white shadow text-sm font-medium text-gray-500 flex items-center justify-between px-4'
            />
          </div>
          <div className='w-full h-16 flex items-start justify-start px-4 gap-2'>
            {story.tags.map((tag, index) => (
              <div className='px-1 py-1 bg-gray-100 rounded-full text-sm font-semibold flex items-center justify-between' key={index}>
                <p className='px-2'>{tag}</p>
                <button onClick={() => removeTag(tag)} className='w-6 h-6 rounded-full text-black hover:bg-red-600 hover:text-white'>
                  <i class="fa-solid fa-xmark text-[11px]"></i>
                </button>
              </div>
            ))}
          </div>
          <button className='px-8 bg-[#7469b6] text-white' onClick={() => setStoryInfo(false)}>
            Kapat
          </button>
        </div>
      </div> : null}
    </div>

  );
}

export default WritingStory;
