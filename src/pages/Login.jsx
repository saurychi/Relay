import { Header } from '../components/header';
import { FcGoogle } from 'react-icons/fc';
import styles from './css/Login.module.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const login = async () => {
        if(email === "" || password === "") {
            alert("Please fill in all fields");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("User logged in successfully");
            navigate("/");
        } catch (err) {
            alert("Make sure the account exists");
            console.error("Error logging in: ", err);
        }
    };

    return (
        <main className={styles.main}>
            <Header />
            <div className={styles.wrapper}>
                <div className={styles.loginForm}>
                    <h1>Login</h1>
                    <input
                        type='text'
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}/>
                    <input
                        type='password'
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}/>

                    <p>or</p>

                    <button className={styles.googleLoginButton}>
                        <FcGoogle size={24} />
                        Log in to Google Account
                    </button>

                    <p>
                        Don't have an account yet? <a href="/signup">Sign Up Here</a>
                    </p>

                    <button className={styles.defaultLoginButton} onClick={login}>Login</button>
                </div>
            </div>
        </main>
    );
};
