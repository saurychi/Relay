import styles from './css/postCard.module.css'
import { MdPerson, MdWifi, MdComment, MdArrowForward  } from 'react-icons/md';
import { db } from '../config/firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const PostCard = ({ id, title, content, author, date_created, comments, likes, getPosts, isMyPost }) => {
    const navigate = useNavigate();

    const addLike = async (id) => {
        const postDoc = doc(db, "posts", id);
        await updateDoc(postDoc, {
            likes: likes + 1
        });
        getPosts();
    }

    const goToPost = (id) => {
        navigate(`/feed/${id}`);
    };

    const goToEdit = (id) => {
        navigate(`/myposts/${id}`);
    };

    return (
        <div key={id} className={styles.postCardContainer}>
            <div className={styles.authorContainer}>
                <div>
                    <MdPerson color="white" size={24} />
                </div>
                <p>@{author} · {date_created}</p>
            </div>

            <h2>{title}</h2>
            <p>{content}</p>

            <div className={styles.buttonContainer}>
                <button onClick={() => addLike(id)}>
                    <MdWifi color="#2980B9" size={24} />
                    <p>{likes}</p>
                </button>
                <button>
                    <MdComment color="#2E4053" size={24} />
                    <p>{comments}</p>
                </button>
                {isMyPost ? (
                    <button onClick={() => goToEdit(id)}>
                        <p>See more</p>
                        <MdArrowForward color="black" size={24}/>
                    </button>
                ) : (
                    <button onClick={() => goToPost(id)}>
                        <p>See more</p>
                        <MdArrowForward color="black" size={24}/>
                    </button>
                )}
            </div>
        </div>
    );
};
