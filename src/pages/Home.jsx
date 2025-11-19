import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import PostCard from '../components/PostCard';
import '../components/Pagination.css';
import './Home.css';

export default function Home() {
    const { posts, loading, refreshPosts, pagination, changePage } = useBlog();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        refreshPosts();
    }, []);

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
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-text">DevPulse in action</span>
                        <svg className="arrow-doodle" width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 10 C 20 20, 40 10, 40 30" stroke="currentColor" strokeWidth="2" fill="none" />
                            <path d="M35 25 L 40 30 L 30 35" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </div>

                    <h1 className="main-headline">
                        Turn ideas into <span className="highlight-text">reality</span><br />
                        with developer insights
                    </h1>

                    <p className="sub-headline">
                        A modern platform where developers share knowledge, spark innovation,
                        and build the future together. Join the conversation today.
                    </p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                            <span>Share knowledge freely</span>
                        </div>
                        <div className="feature-item">
                            <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                            <span>Connect with peers</span>
                        </div>
                        <div className="feature-item">
                            <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                            <span>Grow your career</span>
                        </div>
                    </div>

                    <Link to="/create" className="cta-button btn-ripple">
                        Start Writing →
                    </Link>
                </div>
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
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading posts...</p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <p className="no-posts">
                        {searchQuery ? `No posts found matching "${searchQuery}"` : 'No posts yet. Share your first insight!'}
                    </p>
                ) : (
                    <>
                        {filteredPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}

                        {!searchQuery && pagination && pagination.totalPages > 1 && (
                            <div className="pagination-container">
                                <button
                                    className="pagination-btn"
                                    disabled={!pagination.hasPrevPage}
                                    onClick={() => changePage(pagination.currentPage - 1)}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                    Previous
                                </button>

                                <div className="pagination-info">
                                    Page <span>{pagination.currentPage}</span> of <span>{pagination.totalPages}</span>
                                </div>

                                <button
                                    className="pagination-btn"
                                    disabled={!pagination.hasNextPage}
                                    onClick={() => changePage(pagination.currentPage + 1)}
                                >
                                    Next
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
