import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import './CreatePost.css';

export default function CreatePost() {
    const navigate = useNavigate();
    const { addPost } = useBlog();
    const { currentUser } = useAuth();
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !excerpt || !content) {
            alert('Please fill in all fields');
            return;
        }

        const postId = await addPost({ title, excerpt, content }, currentUser);
        navigate(`/post/${postId}`);
    };

    if (!currentUser) {
        return null;
    }

    return (
        <div className="create-post">
            <h1>Share Your Insights</h1>

            <form onSubmit={handleSubmit} className="post-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter your post title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="excerpt">Summary</label>
                    <input
                        type="text"
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Brief summary of your post"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post content here..."
                        rows="15"
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">
                    Publish Post
                </button>
            </form>
        </div>
    );
}
