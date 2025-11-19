import './SkeletonLoader.css';

export default function SkeletonLoader({ type = 'text', count = 1, height = '1rem' }) {
    if (type === 'likes') {
        return (
            <div className="skeleton-likes">
                <div className="skeleton-btn"></div>
                <div className="skeleton-btn"></div>
            </div>
        );
    }

    if (type === 'comment') {
        return (
            <div className="skeleton-comment">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-comment-content">
                    <div className="skeleton-line" style={{ width: '30%', height: '0.875rem' }}></div>
                    <div className="skeleton-line" style={{ width: '100%', height: '1rem', marginTop: '0.5rem' }}></div>
                    <div className="skeleton-line" style={{ width: '80%', height: '1rem', marginTop: '0.25rem' }}></div>
                </div>
            </div>
        );
    }

    // Default text skeleton
    return (
        <div className="skeleton-container">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="skeleton-line" style={{ height }}></div>
            ))}
        </div>
    );
}
