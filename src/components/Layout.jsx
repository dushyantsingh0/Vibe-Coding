import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout({ children }) {
    const { currentUser, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            alert('Failed to sign out');
        }
    };

    return (
        <div className="layout">
            <header className="header">
                <div className="header-content">
                    <Link to="/" className="header-logo">DevPulse</Link>
                    <nav className="nav">
                        <Link to="/">Home</Link>
                        <Link to="/about">About</Link>
                        {currentUser && <Link to="/create">Write</Link>}
                        {currentUser ? (
                            <div className="user-profile">
                                <img src={currentUser.photoURL} alt={currentUser.displayName} className="user-avatar" />
                                <span className="user-name">{currentUser.displayName}</span>
                                <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
                            </div>
                        ) : (
                            <Link to="/login">Sign In</Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="main">
                {children}
            </main>

            <footer className="footer">
                <p>© 2025 DevPulse. Built with React, Firebase & Neon.</p>
            </footer>
        </div>
    );
}
