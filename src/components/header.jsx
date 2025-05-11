import styles from './css/header.module.css';
import relayIcon from '../assets/relay_icon_light.png';
import { MdGroup, MdNotifications } from 'react-icons/md';

export const Header = () => {
    return (
        <header className={styles.header}>
        <div className={styles.header1}>
            <img src={relayIcon} alt="relay icon" className={styles.header1Img} />
            <input type="text" placeholder="Search" className={styles.header1Input} />
        </div>
        <div className={styles.header2}>
            <div className={styles.header2IconWrapper}>
                <MdGroup color="white" size={24} />
            </div>
            <div className={styles.header2IconWrapper}>
                <MdNotifications color="white" size={24} />
            </div>
            <div className={styles.header2IconWrapper}>

            </div>
        </div>
        </header>
    );
};
