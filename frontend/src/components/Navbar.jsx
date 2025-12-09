import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import '../styles/Navbar.css';

/**
 * Main navigation bar component.
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
                    <span className="brand-icon">🔗</span>
                    <span className="brand-text">SyncUp</span>
                </Link>

                {isAuthenticated && (
                    <div className="navbar-menu">
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        <Link to="/activities" className="nav-link">Explore</Link>
                        <Link to="/my-activities" className="nav-link">My Activities</Link>
                        <Link to="/profile" className="nav-link">Profile</Link>
                        <button onClick={handleLogout} className="btn btn-outline btn-sm">
                            Logout
                        </button>
                    </div>
                )}

                {!isAuthenticated && (
                    <div className="navbar-menu">
                        <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
