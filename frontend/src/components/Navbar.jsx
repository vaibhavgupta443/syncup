import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import '../styles/Navbar.css';

/**
 * Main navigation bar component with premium branding.
 */
const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="brand-icon">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <defs>
                                <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#f97316" />
                                    <stop offset="50%" stopColor="#ec4899" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                            <circle cx="16" cy="16" r="14" stroke="url(#brandGradient)" strokeWidth="3" fill="none" />
                            <path d="M10 16C10 13 12 10 16 10C20 10 22 13 22 16" stroke="url(#brandGradient)" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M10 16C10 19 12 22 16 22C20 22 22 19 22 16" stroke="url(#brandGradient)" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="16" cy="16" r="3" fill="url(#brandGradient)" />
                        </svg>
                    </div>
                    <span className="brand-text">SyncUp</span>
                </Link>

                {isAuthenticated && (
                    <div className="navbar-menu">
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/activities" className="nav-link">Explore</Link>
                        <Link to="/my-activities" className="nav-link">My Activities</Link>
                        <Link to="/profile" className="nav-link">Profile</Link>
                        <button onClick={handleLogout} className="btn-logout">
                            Logout
                        </button>
                    </div>
                )}

                {!isAuthenticated && (
                    <div className="navbar-menu">
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="btn-get-started">Get Started</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
