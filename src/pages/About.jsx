import './About.css';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="about">
            <div className="about-hero">
                <span className="about-badge">Our Story</span>
                <h1>Built for developers,<br />by <span className="highlight-text">developers</span></h1>
                <p className="about-subtitle">
                    DevPulse started with a simple idea: a place where code isn't just syntax, but a story waiting to be told.
                </p>
            </div>

            <div className="about-grid">
                <section className="about-card">
                    <div className="card-icon">🚀</div>
                    <h2>Why DevPulse?</h2>
                    <p>
                        In a world of noisy social feeds and algorithmic distractions, we wanted to build a sanctuary for technical writing.
                        A place where the quality of your code and the clarity of your thought matter more than likes or trends.
                    </p>
                </section>

                <section className="about-card">
                    <div className="card-icon">💡</div>
                    <h2>Open Knowledge</h2>
                    <p>
                        We believe that knowledge grows when it's shared. Whether you're debugging a tricky race condition or
                        architecting a new system, your experience can light the way for someone else. No paywalls, no gatekeeping.
                    </p>
                </section>

                <section className="about-card">
                    <div className="card-icon">🤝</div>
                    <h2>Community First</h2>
                    <p>
                        DevPulse is powered by you. It's a community of curious minds, passionate builders, and lifelong learners.
                        We're here to connect, collaborate, and push the boundaries of what's possible with code.
                    </p>
                </section>
            </div>

            <section className="join-section">
                <div className="join-content">
                    <h2>Write your first post today</h2>
                    <p>
                        Your unique perspective is valuable. Share your journey, teach what you know, and connect with peers.
                    </p>
                    <Link to="/create" className="join-btn">Start Writing</Link>
                </div>
            </section>
        </div>
    );
}
