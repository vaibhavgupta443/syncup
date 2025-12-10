import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../redux/slices/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import '../styles/Auth.css';

/**
 * Registration page component with hero image.
 */
const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
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

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.age) {
            newErrors.age = 'Age is required';
        } else if (formData.age < 13 || formData.age > 120) {
            newErrors.age = 'Age must be between 13 and 120';
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

        const { confirmPassword, ...registrationData } = formData;
        registrationData.age = parseInt(registrationData.age);

        try {
            await dispatch(register(registrationData)).unwrap();
            navigate('/profile/create');
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    return (
        <div className="auth-container">
            {/* Hero Section - visible on desktop */}
            <div className="auth-hero">
                <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
                    alt="Team collaboration"
                    className="auth-hero-image"
                />
                <div className="auth-hero-overlay">
                    <h2>Find Your Tribe</h2>
                    <p>Whether it's sports, music, study groups, or adventures – find like-minded people near you.</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="auth-content">
                <div className="auth-card card fade-in">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <svg width="44" height="44" viewBox="0 0 36 36" fill="none">
                                <defs>
                                    <linearGradient id="regBrandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#0ea5e9" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                                <circle cx="18" cy="18" r="16" fill="url(#regBrandGradient)" />
                                <path d="M12 14C12 14 14 18 18 18C22 18 24 14 24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M12 22C12 22 14 18 18 18C22 18 24 22 24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                <circle cx="18" cy="18" r="3" fill="white" />
                            </svg>
                            <span className="logo-text">SyncUp</span>
                        </div>
                        <h1>Create Account</h1>
                        <p className="text-muted">Join the community and start connecting</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <Input
                            label="Full Name"
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            error={errors.fullName}
                            required
                        />

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
                            label="Age"
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter your age"
                            error={errors.age}
                            required
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            error={errors.password}
                            required
                        />

                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            error={errors.confirmPassword}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="auth-submit-btn"
                        >
                            Create Account
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <p className="text-muted">
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">
                                Sign In
                            </Link>
                        </p>
                    </div>

                    <div className="auth-social-proof">
                        <p>🎯 <strong>50+</strong> activity categories • 🌍 <strong>100+</strong> cities</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
