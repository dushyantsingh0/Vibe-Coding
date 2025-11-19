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

    const handleFileImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!['txt', 'md'].includes(fileExtension)) {
            alert('Please select a .txt or .md file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const fileContent = event.target.result;
            parseFileContent(fileContent, fileExtension);
        };
        reader.readAsText(file);
    };

    const parseFileContent = (content, extension) => {
        let parsedTitle = '';
        let parsedExcerpt = '';
        let parsedContent = content;

        if (extension === 'md') {
            // Check for YAML frontmatter
            const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
            const match = content.match(frontmatterRegex);

            if (match) {
                // Parse frontmatter
                const frontmatter = match[1];
                parsedContent = match[2].trim();

                const titleMatch = frontmatter.match(/title:\s*(.+)/);
                const excerptMatch = frontmatter.match(/excerpt:\s*(.+)/);

                if (titleMatch) parsedTitle = titleMatch[1].trim().replace(/['"]/g, '');
                if (excerptMatch) parsedExcerpt = excerptMatch[1].trim().replace(/['"]/g, '');
            }

            // If no frontmatter or missing fields, extract from content
            if (!parsedTitle) {
                const h1Match = parsedContent.match(/^#\s+(.+)$/m);
                if (h1Match) {
                    parsedTitle = h1Match[1].trim();
                    // Remove the H1 from content
                    parsedContent = parsedContent.replace(/^#\s+.+$/m, '').trim();
                }
            }

            if (!parsedExcerpt) {
                // Extract first paragraph as excerpt
                const paragraphs = parsedContent.split('\n\n');
                const firstParagraph = paragraphs.find(p => p.trim() && !p.startsWith('#'));
                if (firstParagraph) {
                    // Strip markdown formatting for excerpt
                    parsedExcerpt = firstParagraph
                        .replace(/[*_`#\[\]]/g, '')
                        .substring(0, 150)
                        .trim();
                }
            }
        } else if (extension === 'txt') {
            // For .txt files, first line is title
            const lines = content.split('\n');
            parsedTitle = lines[0].trim();

            // Second paragraph or first 150 chars as excerpt
            const remainingContent = lines.slice(1).join('\n').trim();
            const paragraphs = remainingContent.split('\n\n');
            parsedExcerpt = paragraphs[0]?.substring(0, 150).trim() || '';

            // Rest is content
            parsedContent = remainingContent;
        }

        // Set the form fields
        setTitle(parsedTitle);
        setExcerpt(parsedExcerpt);
        setContent(parsedContent);
        setActiveTab('edit');
    };

    if (!currentUser) {
        return null;
    }

    return (
        <div className="create-post">
            <h1>Share Your Insights</h1>

            <form onSubmit={handleSubmit} className="post-form">
                {/* File Import Section */}
                <div className="file-import-section">
                    <label className="file-import-label">
                        📄 Import from File
                    </label>
                    <div className="file-import-controls">
                        <input
                            type="file"
                            id="file-import"
                            accept=".txt,.md"
                            onChange={handleFileImport}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="file-import" className="file-import-btn">
                            📁 Choose File (.txt or .md)
                        </label>
                        <span className="file-import-hint">
                            Import post content from a text or markdown file
                        </span>
                    </div>
                </div>

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
