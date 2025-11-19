import React, { forwardRef } from 'react';
import './CreativeCard.css';

const CreativeCard = forwardRef(({ post }, ref) => {
    if (!post) return null;

    // Format date
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="creative-card-wrapper" ref={ref}>
            <div className="creative-card-content">
                <div className="card-header">
                    <div className="brand-badge">
                        <span className="brand-icon">⚡</span>
                        <span className="brand-name">DevPulse</span>
                    </div>
                    <span className="card-date">{formattedDate}</span>
                </div>

                <div className="card-body">
                    <h1 className="card-title">{post.title}</h1>
                    <p className="card-excerpt">{post.excerpt}</p>
                </div>

                <div className="card-footer">
                    <div className="author-info">
                        {post.authorPhoto ? (
                            <img src={post.authorPhoto} alt={post.authorName} className="author-avatar" />
                        ) : (
                            <div className="author-avatar-placeholder">{post.authorName?.[0]}</div>
                        )}
                        <div className="author-details">
                            <span className="author-name">{post.authorName}</span>
                            <span className="author-label">Author</span>
                        </div>
                    </div>
                    <div className="read-more-tag">
                        Read more on DevPulse
                    </div>
                </div>
            </div>

            {/* Background decorative elements */}
            <div className="card-bg-decoration circle-1"></div>
            <div className="card-bg-decoration circle-2"></div>
        </div>
    );
});

CreativeCard.displayName = 'CreativeCard';

export default CreativeCard;
