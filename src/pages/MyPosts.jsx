import { Header } from '../components/header'
import styles from './css/MyPosts.module.css';
import { MdGroup, MdSearch , MdPerson, MdAdd, MdDynamicFeed } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { getDocs, collection } from 'firebase/firestore';
import { PostCard } from '../components/postCard';
import { getAuth } from 'firebase/auth';
import { AddPost } from '../components/AddPost';
import { useNavigate } from 'react-router-dom';

export const MyPosts = () => {

    const [feedList, setFeedList] = useState([]);
    const [hideAddPost, setHideAddPost] = useState(false);

    const postsCollectionRef = collection(db, "posts");
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const navigate = useNavigate();

    const toggleHidePost = () => {
        setHideAddPost(prev => !prev);
    };

    const goToFeed = () => {
        navigate("/feed");
    }

    const getPosts = async () => {
        try {
            const data = await getDocs(postsCollectionRef);
            // console.log(data)
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))
            .filter((post) => post.author_email == currentUser.email);
            // console.log(filteredData);
            setFeedList(filteredData);
        } catch (err) {
            console.error("Error getting documents: ", err);
        }
    }

    const showAddPost = () => {
        toggleHidePost();
    }

    useEffect(() => {
        getPosts();
    }, []);

    const handleCloseAddPost = () => {
        toggleHidePost();
        getPosts();
    };

    return (
        <main className={styles.main}>
            <Header />
            {hideAddPost && <AddPost onClose={handleCloseAddPost} />}
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
                        <button onClick={goToFeed}>
                            <MdDynamicFeed color="white" size={24} />
                            <p>Feed</p>
                        </button>
                        <button>
                            <MdPerson color="white" size={24} />
                            <p>Profile</p>
                        </button>
                    </div>
                </div>
                <div className={styles.feedContainer}>
                    {feedList.map((feed) => {
                        return (
                            <PostCard
                                id={feed.id}
                                title={feed.title}
                                content={feed.content}
                                author={feed.author_email}
                                date_created={feed.date_created.toDate().toLocaleDateString()}
                                comments={feed.comments}
                                likes={feed.likes}
                                getPosts={getPosts}
                                isMyPost={true}
                            />
                        )
                    })}
                </div>
                <div className={styles.rightContainer}>
                    <button onClick={showAddPost}>
                        <MdAdd color="white" size={24} />
                        <p>New Post</p>
                    </button>
                    <div className={styles.FriendsContainer}>
                        <h2>Friends</h2>
                        <div>
                            <div>
                                <p>Walter Arnold Janssen Caballero</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
