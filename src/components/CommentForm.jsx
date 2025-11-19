import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import './CommentForm.css';

export default function CommentForm({ onSubmit }) {
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setLoading(true);
        try {
            await onSubmit(comment);
            setComment(''); // Clear form on success
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="comment-input"
                rows="3"
                disabled={loading}
                required
            />
            <button
                type="submit"
                className="submit-btn btn-ripple"
                disabled={loading || !comment.trim()}
            >
                {loading ? (
                    <>
                        <LoadingSpinner size="small" color="white" />
                        <span>Posting...</span>
                    </>
                ) : (
                    'Post Comment'
                )}
            </button>
        </form>
    );
}
