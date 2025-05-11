import { Header } from '../components/header';
import { useNavigate } from 'react-router-dom';
import relayIcon from '../assets/relay_icon_dark.png';
import styles from './css/Welcome.module.css';

export const Welcome = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <main className={styles.main}>
            <Header />
            <div className={styles.content}>
                <img src={relayIcon} alt="Relay Icon" className={styles.image} />
                <p className={styles.description}>
                    Welcome to Relay — where seamless connections meet meaningful conversations. Relay lets you effortlessly post your thoughts, ping to show support, and commentate to engage with others, transforming the way you connect and amplify ideas.
                </p>
                <button onClick={goToLogin} className={styles.button}>connect!</button>
            </div>
        </main>
    );
};
