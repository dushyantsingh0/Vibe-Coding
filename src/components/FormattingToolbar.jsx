import { useState } from 'react';
import './FormattingToolbar.css';

export default function FormattingToolbar({ textareaRef, onInsert }) {
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkText, setLinkText] = useState('');
    const [linkUrl, setLinkUrl] = useState('');

    const insertMarkdown = (before, after = '', placeholder = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const textToInsert = selectedText || placeholder;

        const newText = before + textToInsert + after;
        const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);

        onInsert(newValue);

        // Set cursor position
        setTimeout(() => {
            if (selectedText) {
                textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
            } else {
                textarea.setSelectionRange(start + before.length, start + before.length + placeholder.length);
            }
            textarea.focus();
        }, 0);
    };

    const handleBold = () => insertMarkdown('**', '**', 'bold text');
    const handleItalic = () => insertMarkdown('*', '*', 'italic text');
    const handleHeading = (level) => {
        const prefix = '#'.repeat(level) + ' ';
        insertMarkdown(prefix, '', 'Heading');
    };
    const handleList = () => insertMarkdown('- ', '', 'List item');
    const handleNumberedList = () => insertMarkdown('1. ', '', 'List item');
    const handleCode = () => insertMarkdown('`', '`', 'code');
    const handleCodeBlock = () => insertMarkdown('```\n', '\n```', 'code block');
    const handleBlockquote = () => insertMarkdown('> ', '', 'Quote');

    const handleLinkClick = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        setLinkText(selectedText || '');
        setShowLinkModal(true);
    };

    const insertLink = () => {
        if (!linkText || !linkUrl) {
            alert('Please enter both link text and URL');
            return;
        }

        insertMarkdown(`[${linkText}](`, ')', linkUrl);
        setShowLinkModal(false);
        setLinkText('');
        setLinkUrl('');
    };

    const handleKeyDown = (e) => {
        // Keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    handleBold();
                    break;
                case 'i':
                    e.preventDefault();
                    handleItalic();
                    break;
                case 'k':
                    e.preventDefault();
                    handleLinkClick();
                    break;
                default:
                    break;
            }
        }
    };

    // Attach keyboard listener
    if (textareaRef.current) {
        textareaRef.current.onkeydown = handleKeyDown;
    }

    return (
        <>
            <div className="formatting-toolbar">
                <div className="toolbar-group">
                    <button
                        type="button"
                        className="toolbar-btn"
                        onClick={handleBold}
                        title="Bold (Ctrl+B)"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        type="button"
                        className="toolbar-btn"
                        onClick={handleItalic}
                        title="Italic (Ctrl+I)"
                    >
                        <em>I</em>
                    </button>
                </div>

                <div className="toolbar-divider"></div>

                <div className="toolbar-group">
                    <button
                        type="button"
                        className="toolbar-btn"
                        onClick={() => handleHeading(1)}
                        title="Heading 1"
                    >
                        H1
                    </button>
                    <button
                        type="button"
                        className="toolbar-btn"
                        onClick={() => handleHeading(2)}
                        title="Heading 2"
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        className="toolbar-btn"
                        onClick={() => handleHeading(3)}
                        title="Heading 3"
                    >
                        H3
                    </button>
                </div>

                <div className="toolbar-divider"></div>

                <div className="toolbar-group">
                    <button
                        type="button"
                        className="toolbar-btn"
                        onClick={handleList}
                        title="Bullet List"
                    >
                        ≡
                    </button>
                    <button
                        type="button"
                        className="toolbar-btn"
                        onClick={handleNumberedList}
                        title="Numbered List"
                    >
                        1.
                    </button>
                </div>

                <div className="toolbar-divider"></div>

                <div className="toolbar-group">
                    <button
                        type="button"
                        className="toolbar-btn"
                        onClick={handleLinkClick}
                        title="Insert Link (Ctrl+K)"
                    >
                        🔗
                    </button>
                    <button
                        type="button"
                        className="toolbar-btn"
                        onClick={handleCode}
                        title="Inline Code"
                    >
                        &lt;/&gt;
                    </button>
                    <button
                        type="button"
                        className="toolbar-btn"
                        onClick={handleCodeBlock}
                        title="Code Block"
                    >
                        { }
                    </button>
                    <button
                        type="button"
                        className="toolbar-btn"
                        onClick={handleBlockquote}
                        title="Blockquote"
                    >
                        "
                    </button>
                </div>
            </div>

            {showLinkModal && (
                <div className="link-modal-overlay" onClick={() => setShowLinkModal(false)}>
                    <div className="link-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Insert Link</h3>
                        <div className="link-modal-field">
                            <label htmlFor="link-text">Link Text</label>
                            <input
                                id="link-text"
                                type="text"
                                value={linkText}
                                onChange={(e) => setLinkText(e.target.value)}
                                placeholder="Enter link text"
                                autoFocus
                            />
                        </div>
                        <div className="link-modal-field">
                            <label htmlFor="link-url">URL</label>
                            <input
                                id="link-url"
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="link-modal-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setShowLinkModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="insert-btn"
                                onClick={insertLink}
                            >
                                Insert
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
