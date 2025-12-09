import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import '../styles/Navbar.css';

/**
 * Main navigation bar with professional blue branding.
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
