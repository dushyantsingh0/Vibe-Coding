import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import FormattingToolbar from '../components/FormattingToolbar';
import './CreatePost.css';

// Configure marked for better rendering
marked.setOptions({
    breaks: true,
    gfm: true,
});

export default function CreatePost() {
    const navigate = useNavigate();
    const { addPost } = useBlog();
    const { currentUser } = useAuth();
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'
    const textareaRef = useRef(null);

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

    const renderPreview = () => {
        const rawHtml = marked(content);
        const cleanHtml = DOMPurify.sanitize(rawHtml);
        return { __html: cleanHtml };
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

                    {/* Tab Navigation */}
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
                            <FormattingToolbar
                                textareaRef={textareaRef}
                                onInsert={setContent}
                            />
                            <textarea
                                ref={textareaRef}
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your post content here... Use the toolbar above to format your text!"
                                rows="15"
                                required
                            />
                        </>
                    ) : (
                        <div className="preview-pane">
                            {content ? (
                                <div
                                    className="preview-content"
                                    dangerouslySetInnerHTML={renderPreview()}
                                />
                            ) : (
                                <p className="preview-placeholder">Nothing to preview yet. Start writing in the Edit tab!</p>
                            )}
                        </div>
                    )}
                </div>

                <button type="submit" className="submit-btn">
                    Publish Post
                </button>
            </form>
        </div>
    );
}
