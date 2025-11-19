import { useEffect, useState } from 'react';
import { useBlog } from '../context/BlogContext';
import PostCard from '../components/PostCard';
import './Home.css';

export default function Home() {
    const { posts, loading, refreshPosts } = useBlog();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Refresh posts when component mounts to ensure we have latest data
        refreshPosts();
    }, []);

    if (loading) {
        return (
            <div className="home">
                <section className="hero">
                    <h1 className="hero-title">DevPulse</h1>
                    <p className="hero-subtitle">Where developers share insights, ideas, and innovations.</p>
                </section>
                <div className="loading">Loading posts...</div>
            </div>
        );
    }

    // Filter posts based on search query
    const filteredPosts = posts.filter(post => {
        const query = searchQuery.toLowerCase();
        return (
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.content.toLowerCase().includes(query)
        );
    });

    return (
        <div className="home">
            <section className="hero">
                <h1 className="hero-title">DevPulse</h1>
                <p className="hero-subtitle">Where developers share insights, ideas, and innovations.</p>
            </section>

            <div className="search-container">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search posts by title, content, or summary..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button className="clear-search" onClick={() => setSearchQuery('')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                )}
            </div>

            <section className="posts">
                {filteredPosts.length === 0 ? (
                    <p className="no-posts">
                        {searchQuery ? `No posts found matching "${searchQuery}"` : 'No posts yet. Share your first insight!'}
                    </p>
                ) : (
                    filteredPosts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </section>
        </div>
    );
}
