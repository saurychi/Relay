import './App.css'
import { Routes, Route } from 'react-router-dom';
import { Feed } from './pages/Feed';
import { SignUp } from './pages/SignUp';
import { Welcome } from './pages/welcome';
import { Login } from './pages/Login';
import { Post } from './pages/Post';
import { MyPosts } from './pages/MyPosts';
import { EditPost } from './pages/EditPost';

function App() {
	return (
        <Routes>
            <Route path="/feed" element={<Feed />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Welcome />} />
            <Route path="/feed/:id" element={<Post />} />
            <Route path="/myposts" element={<MyPosts />} />
            <Route path="/myposts/:id" element={<EditPost />} />
        </Routes>
    )
}

export default App
