import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useAuth } from '../context/AuthContext';
import FormattingToolbar from '../components/FormattingToolbar';
import './CreatePost.css';

// Configure marked for better rendering
marked.setOptions({
    breaks: true,
    gfm: true,
});

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [activeTab, setActiveTab] = useState('edit');
    const [loading, setLoading] = useState(true);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        // Fetch the post to edit
        const fetchPost = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || '/api';
                const response = await fetch(`${API_URL}/posts/${id}`);
                if (!response.ok) throw new Error('Post not found');

                const post = await response.json();

                // Check if user is the author
                if (post.authorId !== currentUser.uid) {
                    alert('You can only edit your own posts');
                    navigate(`/post/${id}`);
                    return;
                }

                setTitle(post.title);
                setExcerpt(post.excerpt);
                setContent(post.content);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching post:', error);
                alert('Failed to load post');
                navigate('/');
            }
        };

        fetchPost();
    }, [id, currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !excerpt || !content) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${API_URL}/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, excerpt, content }),
            });

            if (!response.ok) throw new Error('Failed to update post');

            navigate(`/post/${id}`);
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post');
        }
    };

    const renderPreview = () => {
        const rawHtml = marked(content);
        const cleanHtml = DOMPurify.sanitize(rawHtml);
        return { __html: cleanHtml };
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="create-post">
            <h1>Edit Your Post</h1>

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

                    {/* Editor Tabs */}
                    <div className="editor-tabs">
                        <button
                            type="button"
                            className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
                            onClick={() => setActiveTab('edit')}
                        >
                            ✏️ Edit
                        </button>
                        <button
                            type="button"
                            className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('preview')}
                        >
                            👁️ Preview
                        </button>
                    </div>

                    {activeTab === 'edit' ? (
                        <>
                            <FormattingToolbar textareaRef={textareaRef} />
                            <textarea
                                ref={textareaRef}
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your post content here using markdown..."
                                rows="15"
                                required
                            />
                        </>
                    ) : (
                        <div className="preview-pane">
                            {content ? (
                                <div className="preview-content" dangerouslySetInnerHTML={renderPreview()} />
                            ) : (
                                <p className="preview-placeholder">Nothing to preview yet. Start writing!</p>
                            )}
                        </div>
                    )}
                </div>

                <button type="submit" className="submit-btn btn-gradient">
                    Update Post
                </button>
            </form>
        </div>
    );
}
