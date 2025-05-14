import { Header } from '../components/header'
import styles from './css/MyPosts.module.css';
import { MdPerson, MdAdd, MdDynamicFeed } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { PostCard } from '../components/postCard';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AddPost } from '../components/AddPost';
import { useNavigate } from 'react-router-dom';

export const MyPosts = () => {

    const [feedList, setFeedList] = useState([]);
    const [hideAddPost, setHideAddPost] = useState(false);
    const [searchContent, setSearchContent] = useState("");

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

    const getPosts = async (user) => {
        try {
            const postsQuery = query(postsCollectionRef, orderBy("date_created", "desc"));
            const data = await getDocs(postsQuery);

            const filteredData = data.docs
                .map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }))
                .filter((post) => post.author_email == user.email);

            setFeedList(filteredData);
        } catch (err) {
            console.error("Error getting documents: ", err);
        }
    }

    const getSearched = async (searchContent) => {
        try {
            const postsQuery = query(postsCollectionRef, orderBy("date_created", "desc"));
            const data = await getDocs(postsQuery);

            const filteredData = data.docs
                .map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }))
                .filter((post) => {
                    const notMyPost = post.author_email !== currentUser?.email;
                    const matchesSearch =
                        post.title.toLowerCase().includes(searchContent.toLowerCase()) ||
                        post.content.toLowerCase().includes(searchContent.toLowerCase());

                    return notMyPost && matchesSearch;
                });

            setFeedList(filteredData);
            setSearchContent("");
        } catch (err) {
            console.error("Error searching posts: ", err);
        }
    };

    const showAddPost = () => {
        toggleHidePost();
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                getPosts(user);
            }
        });

        return () => unsubscribe(); // cleanup listener
    }, []);

    const handleCloseAddPost = () => {
        toggleHidePost();
        getPosts(auth.currentUser);
    };

    return (
        <main className={styles.main}>
            <Header getSearched={getSearched} setSearchContent={setSearchContent} searchContent={searchContent}/>
            {hideAddPost && <AddPost onClose={handleCloseAddPost} />}
            <div className={styles.mainContainer}>
                <div className={styles.leftContainer}>
                    <div className={styles.leftContainerUser}>
                        <p>@{currentUser?.displayName || currentUser?.email || "anonymous"}</p>
                    </div>

                    <div className={styles.leftContainerTabs}>
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
                    {feedList.length > 0 ? (
                        feedList.map((feed) => (
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
                                hasMedia={feed.hasMedia}
                                gif={feed.gif}
                            />
                        ))
                    ) : (
                        <p>Loading...</p>
                    )}
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
