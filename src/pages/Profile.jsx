import { useState } from 'react';
import { Header } from "../components/header";
import { MdArrowBack } from 'react-icons/md';
import styles from './css/Profile.module.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential, GoogleAuthProvider, reauthenticateWithPopup } from 'firebase/auth';
import { collection, query, where, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "../config/firebase";

export const Profile = () => {

    const [newPassword, setNewPassword] = useState("");
    const [newRePassword, setNewRePassword] = useState("");

    const navigate = useNavigate();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const goBack = () => {
        navigate(-1);
    }

    const isGoogleUser = currentUser?.providerData.some(
        (provider) => provider.providerId === "google.com"
    );

    const reauthenticate = async () => {
        if(isGoogleUser) {
            const provider = new GoogleAuthProvider();
            await reauthenticateWithPopup(currentUser, provider);
        } else {
            const password = prompt("Please enter your password again to confirm:");
            if (!password) throw new Error("Password is required for re-authentication.");

            const credential = EmailAuthProvider.credential(
                currentUser.email,
                password
            );

            await reauthenticateWithCredential(currentUser, credential);
        }
    };

    const changePassword = async () => {
        if (currentUser) {
            if (newPassword !== newRePassword) {
                alert("Passwords do not match.");
                return;
            }

            if (isGoogleUser) {
                alert("Password cannot be changed for Google-authenticated accounts.");
                return;
            }

            try {
                await updatePassword(user, newPassword);
                alert("Password updated successfully.");
            } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                alert("Please log in again to change your password.");
            } else {
                alert(error.message);
            }
            }
        } else {
            navigate("/login");
        }
    }

    const deleteUserAccount = async () => {
        if (!currentUser) return;

        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );
        if (!confirmDelete) return;

        try {
            // posts
            const postsRef = collection(db, "posts");
            const postsQuery = query(postsRef, where("author_email", "==", currentUser.email));
            const postsSnapshot = await getDocs(postsQuery);

            // comments
            const commentsRef = collection(db, "comments");
            const commentsQuery = query(commentsRef, where("comment_author", "==", currentUser.email));
            const commentsSnapshot = await getDocs(commentsQuery);

            const batch = writeBatch(db);

            postsSnapshot.forEach((docSnap) => {
                batch.delete(doc(db, "posts", docSnap.id));
            });

            commentsSnapshot.forEach((docSnap) => {
                batch.delete(doc(db, "comments", docSnap.id));
            });

            await batch.commit();

            alert("All posts and comments deleted successfully.");
            await reauthenticate();
            await deleteUser(currentUser);

            alert("Account deleted successfully.");
            navigate("/login");

        } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                alert("Please log in again to delete your account.");
            } else {
                alert(error.message);
            }
        }
    };

    return (
        <main className={styles.main}>
            <Header />
            <div className={styles.mainContainer}>
                <div className={styles.leftContainer}>
                    <div className={styles.leftContainerUser}>
                        <p>@{currentUser?.displayName || currentUser?.email || "anonymous"}</p>
                    </div>

                    <div className={styles.leftContainerTabs}>
                        <button onClick={goBack}>
                            <MdArrowBack size={24} color="white" />
                            <p>Go Back</p>
                        </button>
                    </div>
                </div>
                <div className={styles.feedContainer}>
                    <h1>{currentUser?.email}</h1>

                    <div className={styles.updateContainer}>
                        <h3>Change Password</h3>
                        <input type="text" placeholder="Enter New Password" onChange={(e) => setNewPassword(e.target.value)}/>
                        <input type="text" placeholder="Re-enter New Password" onChange={(e) => setNewRePassword(e.target.value)}/>
                        <button onClick={changePassword}>
                            <p>Update Password</p>
                        </button>
                    </div>
                    <div className={styles.deleteContainer}>
                        <h3>Danger Zone</h3>
                        <button onClick={deleteUserAccount}>
                            <p>Delete User</p>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
