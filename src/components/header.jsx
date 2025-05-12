import styles from './css/header.module.css';
import relayIcon from '../assets/relay_icon_light.png';
import { useState } from 'react';
import { MdGroup, MdNotifications, MdPerson  } from 'react-icons/md';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();

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

    const goToFeed = () => {
        navigate("/feed");
    }

    return (
        <header className={styles.header}>
        <div className={styles.header1}>
            <img src={relayIcon} alt="relay icon" className={styles.header1Img} onClick={goToFeed}/>
            <input type="text" placeholder="Search Post..." className={styles.header1Input} />
        </div>
        <div className={styles.header2}>
            <button className={styles.header2IconWrapper}>
                <MdGroup color="white" size={24} />
            </button>
            <button className={styles.header2IconWrapper}>
                <MdNotifications color="white" size={24} />
            </button>
            <button className={styles.header2IconWrapper} onClick={toggleDropdown}>
                <MdPerson color="white" size={24} />
            </button>
            {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                    <button>Profile</button>
                    <button onClick={toMyPosts}>My Posts</button>
                    <button onClick={logout}>Logout</button>
                </div>
            )}
        </div>
        </header>
    );
};
