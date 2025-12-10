import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../redux/slices/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import '../styles/Auth.css';

/**
 * Login page component with hero image.
 */
const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const result = await dispatch(login(formData)).unwrap();
            if (result.hasProfile) {
                navigate('/dashboard');
            } else {
                navigate('/profile/create');
            }
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <div className="auth-container">
            {/* Hero Section - visible on desktop */}
            <div className="auth-hero">
                <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80"
                    alt="Friends having fun together"
                    className="auth-hero-image"
                />
                <div className="auth-hero-overlay">
                    <h2>Connect. Play. Grow.</h2>
                    <p>Join thousands of people finding activity partners and making new friends in their city.</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="auth-content">
                <div className="auth-card card fade-in">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <svg width="44" height="44" viewBox="0 0 36 36" fill="none">
                                <defs>
                                    <linearGradient id="authBrandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#0ea5e9" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                                <circle cx="18" cy="18" r="16" fill="url(#authBrandGradient)" />
                                <path d="M12 14C12 14 14 18 18 18C22 18 24 14 24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M12 22C12 22 14 18 18 18C22 18 24 22 24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                <circle cx="18" cy="18" r="3" fill="white" />
                            </svg>
                            <span className="logo-text">SyncUp</span>
                        </div>
                        <h1>Welcome Back</h1>
                        <p className="text-muted">Sign in to continue to your dashboard</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            error={errors.email}
                            required
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            error={errors.password}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="auth-submit-btn"
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <p className="text-muted">
                            Don't have an account?{' '}
                            <Link to="/register" className="auth-link">
                                Create Account
                            </Link>
                        </p>
                    </div>

                    <div className="auth-social-proof">
                        <p><strong>5,000+</strong> activities completed • <strong>12,000+</strong> connections made</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
