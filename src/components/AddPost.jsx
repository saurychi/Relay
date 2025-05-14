import { useState } from 'react';
import styles from './css/AddPost.module.css';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp  } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const AddPost = ({ onClose }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [gifQuery, setGifQuery] = useState("");
    const [gifResults, setGifResults] = useState([]);
    const [selectedGif, setSelectedGif] = useState(null);
    const [toggleGif, setToggleGif] = useState(false);


    const moviesCollectionRef = collection(db, "posts");
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const searchGif = async () => {
        const res = await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=${import.meta.env.VITE_GIPHY_API_KEY}&q=${gifQuery}&limit=5`
        );
        const data = await res.json();
        setGifResults(data.data);
        setToggleGif(true);
    };

    const onSubmitMovie = async () => {
        try {
            await addDoc(moviesCollectionRef, {
                title: title,
                content: content,
                author_email: currentUser.email,
                date_created: serverTimestamp(),
                comments: 0,
                likes: 0,
                gif: selectedGif?.images?.downsized?.url || null,
                hasMedia: selectedGif ? true : false
            });
            setTitle("");
            setContent("");
            setSelectedGif(null);
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

                <div className={styles.gifSearchContainer}>
                    <input
                        type="text"
                        placeholder="Search GIF(optional)"
                        onChange={(e) => setGifQuery(e.target.value)}
                    />
                    <button onClick={searchGif}>Search</button>
                </div>

                {toggleGif && (
                    <div className={styles.gifResults}>
                        {gifResults.map(gif => (
                            <img
                                key={gif.id}
                                src={gif.images.fixed_height.url}
                                alt=""
                                onClick={() => {setSelectedGif(gif); setToggleGif(false);}}
                                style={{ border: selectedGif?.id === gif.id ? '2px solid blue' : 'none', cursor: 'pointer' }}
                            />
                        ))}
                        <button onClick={() => {setSelectedGif(null); setToggleGif(false);}}>
                            <p>Cancel</p>
                        </button>
                    </div>
                )}

                <div className={styles.buttonContainer}>
                    <button onClick={onSubmitMovie}>Post</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
