import styles from './css/header.module.css';
import relayIcon from '../assets/relay_icon_light.png';
import { useState } from 'react';
import { MdSearch, MdPerson  } from 'react-icons/md';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header = ({ getSearched, setSearchContent, searchContent }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const toMyPosts = () => {
        navigate("/myposts");
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    const logout = async () => {
        const shouldLogout = window.confirm("Are you sure you want to log out?");
        if (!shouldLogout) return;

        try {
            await signOut(auth);
            navigate("/login");
        } catch (err) {
            console.error("Error logging out: ", err);
        }
    }

    const goToIntro = () => {
        navigate("/");
    }

    const goToProfile = () => {
        navigate("/profile");
    }

    return (
        <header className={styles.header}>
        <div className={styles.header1}>
            <img src={relayIcon} alt="relay icon" className={styles.header1Img} onClick={goToIntro}/>
            {(location.pathname === "/feed" || location.pathname === "/myposts") && (
                <>
                    <input
                        type="text"
                        placeholder="Search..."
                        className={styles.header1Input}
                        value={searchContent}
                        onChange={(e) => setSearchContent(e.target.value)}
                    />
                    <button className={styles.header1Button} onClick={() => getSearched(searchContent)}>
                        <MdSearch color="white" size={24} />
                    </button>
                </>
            )}
        </div>
        <div className={styles.header2}>
            {!["/login", "/signup", "/"].includes(location.pathname) && (
                <button className={styles.header2IconWrapper} onClick={toggleDropdown}>
                    <MdPerson color="white" size={24} />
                </button>
            )}
            {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                    <button onClick={goToProfile}>Profile</button>
                    <button onClick={toMyPosts}>My Posts</button>
                    <button onClick={logout}>Logout</button>
                </div>
            )}
        </div>
        </header>
    );
};
