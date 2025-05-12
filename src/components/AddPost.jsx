import { useState } from 'react';
import styles from './css/AddPost.module.css';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp  } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const AddPost = ({ onClose }) => {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const moviesCollectionRef = collection(db, "posts");
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const onSubmitMovie = async () => {
        try {
            await addDoc(moviesCollectionRef, {
                title: title,
                content: content,
                author_email: currentUser.email,
                date_created: serverTimestamp(),
                comments: 0,
                likes: 0
            });
            setTitle("");
            setContent("");
            onClose();
        } catch (err) {
            console.error("Error adding document: ", err);
        }
    }

    return (
        <div className={styles.addPostContainer}>
            <div className={styles.addPostForm}>
                <h1>Add Post</h1>

                <input type="text" placeholder="Enter title" onChange={(e) => setTitle(e.target.value)}/>
                <textarea placeholder="Enter content"  onChange={(e) => setContent(e.target.value)}></textarea>

                <div className={styles.buttonContainer}>
                    <button onClick={onSubmitMovie}>Post</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
