import { Header } from '../components/header';
import styles from './css/SignUp.module.css';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


export const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    const navigate = useNavigate();

    const signUp = async () => {
        if(email === "" || password === "" || rePassword === "") {
            alert("Please fill in all fields");
            return;
        }

        if(password !== rePassword) {
            alert("Passwords do not match");
            return;
        }


        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("User created successfully");
            navigate("/login");
        } catch (err) {
            console.error("Error signing in: ", err);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/");
        } catch (err) {
            console.error("Error signing in google in: ", err);
        }
    };


    return (
        <main className={styles.main}>
            <Header />
            <div className={styles.wrapper}>
                <div className={styles.signupForm}>
                    <h1>Signup</h1>
                    <input
                        type='text'
                        placeholder='Enter Email'
                        onChange={(e) => setEmail(e.target.value)}/>
                    <input
                        type='password'
                        placeholder='Enter Password'
                        onChange={(e) => setPassword(e.target.value)}/>
                    <input
                        type='password'
                        placeholder='Confirm Password'
                        onChange={(e) => setRePassword(e.target.value)}/>

                    <p>or</p>

                    <button className={styles.googleSignupButton} onClick={signInWithGoogle}>
                        <FcGoogle size={24} />
                        Sign Up to your Google Account
                    </button>

                    <p>
                        Alreay have an account? <a href="/login">Log In Here</a>
                    </p>

                    <button
                        className={styles.defaultSignupButton}
                        onClick={signUp}>Signup</button>
                </div>
            </div>
        </main>
    )
}
