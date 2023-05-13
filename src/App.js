import logo from './logo.svg';
import './App.css';
import Register from './pages/Register/Register';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Feed from './pages/Feed/Feed';
import SharedLayoutPage from './pages/SharedLayoutPage/SharedLayoutPage';
import Profile from './pages/SharedLayoutPage/Profile/Profile';
import Home from './pages/SharedLayoutPage/Home/Home';
import Sidebar from './pages/SharedLayoutPage/Sidebar/Sidebar';
import Modal from './pages/SharedLayoutPage/Modal/Modal';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import CreateTweetModal from './pages/SharedLayoutPage/Tweet/CreateTweetModal';
import SingleUserPage from './pages/SharedLayoutPage/SingleUserPage/SingleUserPage';
import SingleTweetPage from './pages/SharedLayoutPage/SingleTweetPage/SingleTweetPage';


function App() {
  return (
    <>
{/* ! I have shifted the browser router to the index.js file because I was getting an

    error while importing useNavigate Hook in the TweetContext.js
*/}
    {/* ! show the toast for all pages */}
      <ToastContainer />
      <Routes>
        {/* ! if a user is not logged  */}
      <Route path='/' element={<ProtectedRoute><Sidebar /></ProtectedRoute>}>
          {/* ! nested routes */}
          <Route index element={<><Home /> </>} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/:id' element={<SingleUserPage />} />
          <Route path='/tweet/:id' element={<SingleTweetPage />} />
      </Route>

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
