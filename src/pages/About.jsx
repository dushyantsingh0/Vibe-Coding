import './About.css';

export default function About() {
    return (
        <div className="about">
            <h1>About DevPulse</h1>

            <section className="about-section">
                <h2>🚀 Our Mission</h2>
                <p>
                    DevPulse is where developers come alive. We're building a vibrant community where
                    code meets creativity, where ideas spark innovation, and where every developer has
                    a voice that matters.
                </p>
            </section>

            <section className="about-section">
                <h2>💡 What Makes Us Different</h2>
                <p>
                    We believe in the power of shared knowledge. Whether you're debugging your first
                    "Hello World" or architecting distributed systems, your journey matters. DevPulse
                    is designed to celebrate every milestone, every breakthrough, and every lesson learned.
                </p>
                <p>
                    Our platform combines beautiful design with powerful features, making it a joy to
                    write, read, and engage with technical content. No clutter, no distractions—just
                    pure focus on what matters: your ideas.
                </p>
            </section>

            <section className="about-section">
                <h2>🌟 Join the Movement</h2>
                <p>
                    Every great developer was once a beginner. Every revolutionary idea started as a
                    simple thought. At DevPulse, we're creating a space where:
                </p>
                <ul className="feature-list">
                    <li>✨ Your voice is amplified, not lost in the noise</li>
                    <li>🤝 Connections are meaningful, not just metrics</li>
                    <li>📚 Learning is continuous, collaborative, and fun</li>
                    <li>🎨 Expression meets engineering in perfect harmony</li>
                </ul>
            </section>

            <section className="about-section">
                <h2>🎯 Our Vision</h2>
                <p>
                    We envision a world where every developer feels empowered to share their unique
                    perspective. Where technical writing is accessible, engaging, and rewarding. Where
                    the next breakthrough idea is just one post away.
                </p>
                <p>
                    DevPulse isn't just a blogging platform—it's a movement. A community. A home for
                    developers who believe that together, we can build something extraordinary.
                </p>
            </section>

            <section className="about-section cta-section">
                <h2>Ready to Make Your Mark?</h2>
                <p>
                    Sign in with Google and start sharing your developer journey today. Your insights
                    could inspire the next generation of innovators.
                </p>
            </section>
        </div>
    );
}
