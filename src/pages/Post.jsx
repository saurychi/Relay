import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/header';
import styles from './css/Post.module.css'
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getDocs, collection, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AddPost } from '../components/AddPost';
import { MdGroup, MdSearch , MdPerson, MdArrowBack, MdWifi, MdAdd, MdClose  } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export const Post = () => {
    const [hideAddPost, setHideAddPost] = useState(false);
    const [post, setPost] = useState(null);
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState("");

    const { id } = useParams();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const navigate = useNavigate();
    const commentsCollectionRef = collection(db, "comments");

    // useEffect(() => {
    //     if(!currentUser) {
    //         navigate("/login");
    //     }
    // }, [])
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
            const data = await getDocs(commentsCollectionRef);
            // console.log(data)
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }));
            // console.log(filteredData);
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

    const toggleHidePost = () => {
        setHideAddPost(prev => !prev);
    };

    const goBack = () => {
        navigate("/feed");
    }

    const toEditPost = () => {
        navigate(`/feed/edit/${id}`);
    }

    return (
        <div className={styles.main}>
            <Header />
            {hideAddPost && <AddPost onClose={toggleHidePost} />}
            <div className={styles.mainContainer}>
                <div className={styles.leftContainer}>
                    <div className={styles.leftContainerUser}>
                        <div className={styles.leftPfpContainer}>
                            g
                        </div>
                        <p>@{currentUser?.displayName || currentUser?.email || "anonymous"}</p>
                    </div>

                    <div className={styles.leftContainerTabs}>
                        <button>
                            <MdGroup color="white" size={24} />
                            <p>Friends</p>
                        </button>
                        <button>
                            <MdSearch color="white" size={24} />
                            <p>Search</p>
                        </button>
                        <button>
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
                                <h2>{post.title}</h2>
                                <p>{post.content}</p>

                                <div className={styles.buttonContainer}>
                                    <button onClick={() => addLike(id)}>
                                        <MdWifi color="#2980B9" size={24} />
                                        <p>{post.likes}</p>
                                    </button>
                                    {currentUser?.email == post.author_email &&
                                        <button onClick={() => {toEditPost(id)}}>
                                            Edit
                                        </button>
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
