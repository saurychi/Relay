import './App.css'
import { Routes, Route } from 'react-router-dom';
import { Feed } from './pages/Feed';
import { SignUp } from './pages/SignUp';
import { Welcome } from './pages/welcome';
import { Login } from './pages/Login';

function App() {
	return (
        <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/introduction" element={<Welcome />} />

        </Routes>
    )
}

export default App
