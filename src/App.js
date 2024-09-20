import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import Stories from './pages/Stories';
import { Fragment, useEffect } from 'react';
import WritingStory from './pages/WritingStory';
import StoryView from './pages/StoryView';
import ProfileEditing from './pages/ProfileEditing';
import Categories from './pages/Categories';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Interactions from './pages/Interactions';
import Notifications from './pages/Notifications';
import Followers from './pages/Followers';
import Library from './pages/Library';
import FilterTag from './pages/FilterTag';
import FilterCategory from './pages/FilterCategory';

function App() {

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('storyUserId');
    const currentPath = window.location.pathname;

    if (!user && currentPath !== '/login' && currentPath !== '/register') {
      navigate('/login');
    }
  }, [navigate]);


  return (
    <Fragment>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/categories' element={<Categories />} />
        <Route path='/stories' element={<Stories />} />
        <Route path='/create' element={<WritingStory />} />
        <Route path='/create/:storyId' element={<WritingStory />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/library' element={<Library />} />
        <Route path='/story/:storyId' element={<StoryView />} />
        <Route path='/profile/edit' element={<ProfileEditing />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/user/:userId' element={<Profile />} />
        <Route path='/user/edit/profile/:userId' element={<ProfileEditing />} />
        <Route path='/followers/:userId' element={<Followers />} />
        <Route path='/user/:userId/interactions' element={<Interactions />} />
        <Route path='/tag/:tag' element={<FilterTag />} />
        <Route path='/category/:category' element={<FilterCategory />} />
      </Routes>
    </Fragment>
  );
}

export default App;
