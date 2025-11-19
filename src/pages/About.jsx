import './About.css';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="about-page">
            <div className="about-container">
                {/* Hero Section */}
                <section className="about-hero">
                    <h1 className="about-title">About DevPulse</h1>
                    <p className="about-lead">
                        A modern platform where developers share insights, ideas, and innovations.
                    </p>
                </section>

                {/* Mission Section */}
                <section className="about-section">
                    <h2>Our Mission</h2>
                    <p>
                        DevPulse is built for developers who want to share their knowledge and learn from others.
                        We believe in open knowledge, meaningful discussions, and a distraction-free writing experience.
                    </p>
                </section>

                {/* Features Grid */}
                <section className="about-features">
                    <div className="feature-card">
                        <div className="feature-icon">✍️</div>
                        <h3>Distraction-Free Writing</h3>
                        <p>Focus on what matters - your content. Clean, minimal interface with powerful markdown support.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🌐</div>
                        <h3>Open Knowledge</h3>
                        <p>No paywalls, no gatekeeping. Share your expertise and help others grow.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">💬</div>
                        <h3>Engage & Connect</h3>
                        <p>Meaningful conversations with like-minded developers. Build your network.</p>
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="about-section">
                    <h2>Built With</h2>
                    <div className="tech-stack">
                        <span className="tech-badge">React</span>
                        <span className="tech-badge">Vite</span>
                        <span className="tech-badge">Express</span>
                        <span className="tech-badge">Neon PostgreSQL</span>
                        <span className="tech-badge">Firebase Auth</span>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="about-cta">
                    <h2>Start Writing Today</h2>
                    <p>Join our community of developers and share your knowledge.</p>
                    <Link to="/create" className="cta-button">Create Your First Post</Link>
                </section>
            </div>
        </div>
    );
}
