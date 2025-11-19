import './About.css';

export default function About() {
    return (
        <div className="about">
            <div className="about-hero">
                <span className="about-badge">Our Story</span>
                <h1>Building the future of <span className="highlight-text">developer</span> knowledge</h1>
                <p className="about-subtitle">
                    DevPulse is more than just a blog. It's a community where ideas take flight and developers grow together.
                </p>
            </div>

            <div className="about-grid">
                <section className="about-card mission-card">
                    <div className="card-icon">🚀</div>
                    <h2>Our Mission</h2>
                    <p>
                        We're building a vibrant community where code meets creativity.
                        Where every developer has a voice that matters, and every idea has the potential to spark innovation.
                    </p>
                </section>

                <section className="about-card vision-card">
                    <div className="card-icon">🎯</div>
                    <h2>Our Vision</h2>
                    <p>
                        A world where technical knowledge is accessible, engaging, and rewarding.
                        Where the next breakthrough idea is just one post away from changing everything.
                    </p>
                </section>

                <section className="about-card values-card">
                    <div className="card-icon">💡</div>
                    <h2>What We Value</h2>
                    <ul className="values-list">
                        <li>
                            <span className="check">✨</span>
                            <span><strong>Authenticity:</strong> Real stories from real developers</span>
                        </li>
                        <li>
                            <span className="check">🤝</span>
                            <span><strong>Community:</strong> Connections over metrics</span>
                        </li>
                        <li>
                            <span className="check">📚</span>
                            <span><strong>Growth:</strong> Continuous learning together</span>
                        </li>
                    </ul>
                </section>
            </div>

            <section className="join-section">
                <div className="join-content">
                    <h2>Ready to join the movement?</h2>
                    <p>
                        Your unique perspective is what's missing. Start sharing your journey today.
                    </p>
                    <div className="join-stats">
                        <div className="stat">
                            <span className="stat-number">100+</span>
                            <span className="stat-label">Developers</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Posts</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">∞</span>
                            <span className="stat-label">Possibilities</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
