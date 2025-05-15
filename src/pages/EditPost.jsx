import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/header';
import styles from './css/EditPost.module.css'
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getDocs, collection, addDoc, deleteDoc, updateDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AddPost } from '../components/AddPost';
import { MdGroup, MdSearch , MdPerson, MdArrowBack, MdWifi, MdAdd, MdClose  } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export const EditPost = () => {
    const [hideAddPost, setHideAddPost] = useState(false);
    const [post, setPost] = useState(null);
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState("");

    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    const { id } = useParams();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const navigate = useNavigate();
    const commentsCollectionRef = collection(db, "comments");

    const [gifQuery, setGifQuery] = useState("");
    const [gifResults, setGifResults] = useState([]);
    const [selectedGif, setSelectedGif] = useState(null);
    const [toggleGif, setToggleGif] = useState(false);

    const searchGif = async () => {
        const res = await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=${import.meta.env.VITE_GIPHY_API_KEY}&q=${gifQuery}&limit=5`
        );
        const data = await res.json();
        setGifResults(data.data);
        setToggleGif(true);
    };

    // useEffect(() => {
    //     if(!currentUser) {
    //         navigate("/login");
    //     }
    // }, [])

    const updatePost = async (id) => {
        const postDoc = doc(db, "posts", id);
        try {
            await updateDoc(postDoc, {
                title: newTitle,
                content: newContent,
                date_created: serverTimestamp(),
                gif: selectedGif ? selectedGif?.images?.downsized?.url : post.gif,
                hasMedia: selectedGif ? true : false
            });
            alert("Post updated successfully");
            fetchPost();
        } catch (err) {
            console.error("Error updating document: ", err);
        }
    }

    const deletePost = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        const postDoc = doc(db, "posts", id);
        await deleteDoc(postDoc);
        alert("Post deleted successfully");
        navigate("/myposts");
    }

    const addLike = async (id) => {
        const postDoc = doc(db, "posts", id);
        await updateDoc(postDoc, {
            likes: post.likes + 1
        });
        fetchPost();
    }

    const deleteComment = async (id) => {
        const commentDoc = doc(db, "comments", id);
        await deleteDoc(commentDoc);
        getComments(); // refresh the list after deleting a movie
    }

    const addComment = async (id) => {
        try {
            await addDoc(commentsCollectionRef, {
                comment: comment,
                comment_author: currentUser.email,
                post_id: id
            });
            setComment("");
        } catch (err) {
            console.error("Error adding comment: ", err);
        }

        getComments();
    }

    const getComments = async () => {
        try {
            const q = query(commentsCollectionRef, where("post_id", "==", id));
            const data = await getDocs(q);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }));
            setCommentList(filteredData);
        } catch (err) {
            console.error("Error getting documents: ", err);
        }
    }

    const fetchPost = async () => {
        if (!id) return;
        const postRef = doc(db, 'posts', id);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
            setPost(postSnap.data());
        } else {
            console.log("No such document!");
        }
    };

    useEffect(() => {
        fetchPost();
        getComments();
    }, []);

    useEffect(() => {
        setNewTitle(post?.title || "");
        setNewContent(post?.content || "");
    }, [post]);

    const toggleHidePost = () => {
        setHideAddPost(prev => !prev);
    };

    const goBack = () => {
        navigate("/myposts");
    }

    const toProfile = () => {
        navigate
    }

    return (
        <div className={styles.main}>
            <Header />
            {hideAddPost && <AddPost onClose={toggleHidePost} />}
            <div className={styles.mainContainer}>
                <div className={styles.leftContainer}>
                    <div className={styles.leftContainerUser}>
                        <p>@{currentUser?.displayName || currentUser?.email || "anonymous"}</p>
                    </div>

                    <div className={styles.leftContainerTabs}>
                        <button onClick={toProfile}>
                            <MdPerson color="white" size={24} />
                            <p>Profile</p>
                        </button>
                        <button onClick={goBack}>
                            <MdArrowBack size={24} color="white" />
                            <p>Go Back</p>
                        </button>
                    </div>
                </div>
                <div className={styles.feedContainer}>
                    <div className={styles.postContainer}>
                        {post ? (
                            <>
                                <p><span className={styles.authorSpan}>@{post.author_email}</span> · {post.date_created.toDate().toLocaleDateString()}</p>
                                <div className={styles.postForm}>
                                    <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}/>
                                    <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)}></textarea>
                                    <div className={styles.gifSearchContainer}>
                                        <input type="text" placeholder="Search for GIFs..." onChange={(e) => setGifQuery(e.target.value)}/>
                                        <button onClick={searchGif}>
                                            <p>Search</p>
                                        </button>
                                    </div>
                                    {toggleGif ? (
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
                                        ) : (
                                            <div>
                                                <h2>Preview</h2>
                                                {post.hasMedia ? (
                                                    <img src={selectedGif ? (selectedGif.images.fixed_height.url) : (post.gif)} alt="gif" className={styles.gif} />
                                                ) : (
                                                    <p>No gif for this post</p>
                                                )}
                                            </div>
                                        )}
                                </div>
                                <div className={styles.buttonContainer}>
                                    <button onClick={() => addLike(id)}>
                                        <MdWifi color="#2980B9" size={24} />
                                        <p>{post.likes}</p>
                                    </button>
                                    {currentUser?.email == post.author_email &&
                                        <div>
                                            <button onClick={() => deletePost(id)}>
                                                Delete
                                            </button>
                                            <button onClick={() => updatePost(id)}>
                                                Edit
                                            </button>
                                        </div>
                                    }
                                </div>
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                    <div className={styles.commentsContainer}>
                        <h2>Comment</h2>
                        <p>Comment as {currentUser?.email}</p>

                        <textarea value={comment} placeholder="Enter comment..." onChange={(e) => setComment(e.target.value)}></textarea>
                        <button onClick={() => addComment(id)}>
                            <MdAdd color="white" size={24} />
                            <p>Add</p>
                        </button>

                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <h2>Comments</h2>
                    <div className={styles.commentsContainer}>
                        {commentList.map((comment) => {
                            return (
                                <div key={comment.id}>
                                    <div>
                                        <p>{comment.comment_author}</p>
                                        {comment.comment_author == currentUser.email &&
                                            <button onClick={() => deleteComment(comment.id)}>
                                                <MdClose size={24} color="white" />
                                                <p>Delete</p>
                                            </button>
                                        }
                                    </div>

                                    <h3>{comment.comment}</h3>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>

    )

}
