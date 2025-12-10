import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import '../styles/Navbar.css';

/**
 * Main navigation bar with hamburger menu for mobile.
 */
const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setMenuOpen(false);
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="brand-icon">
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                            <defs>
                                <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#0ea5e9" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>
                            <circle cx="18" cy="18" r="16" fill="url(#brandGradient)" />
                            <path d="M12 14C12 14 14 18 18 18C22 18 24 14 24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M12 22C12 22 14 18 18 18C22 18 24 22 24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="18" cy="18" r="3" fill="white" />
                        </svg>
                    </div>
                    <span className="brand-text">SyncUp</span>
                </Link>

                {/* Hamburger Menu Button - Mobile Only */}
                <button
                    className={`hamburger ${menuOpen ? 'active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navigation Menu */}
                {isAuthenticated && (
                    <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
                        <Link to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</Link>
                        <Link to="/activities" className="nav-link" onClick={closeMenu}>Explore</Link>
                        <Link to="/my-activities" className="nav-link" onClick={closeMenu}>My Activities</Link>
                        <Link to="/profile" className="nav-link" onClick={closeMenu}>Profile</Link>
                        <button onClick={handleLogout} className="btn-logout">
                            Logout
                        </button>
                    </div>
                )}

                {!isAuthenticated && (
                    <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
                        <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
                        <Link to="/register" className="btn-get-started" onClick={closeMenu}>Get Started</Link>
                    </div>
                )}
            </div>

            {/* Overlay for mobile menu */}
            {menuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
        </nav>
    );
};

export default Navbar;
