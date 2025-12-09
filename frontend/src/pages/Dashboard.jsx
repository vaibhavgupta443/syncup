import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchRecommendations, fetchMyCreatedActivities, fetchMyJoinedActivities } from '../redux/slices/activitySlice';
import { fetchMyProfile } from '../redux/slices/profileSlice';
import ActivityCard from '../components/ActivityCard';
import Button from '../components/Button';
import '../styles/Dashboard.css';

// Category showcase with vibrant images
const categoryShowcase = [
    { name: 'Sports', emoji: '⚽', image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=400&q=80', color: '#10b981' },
    { name: 'Music', emoji: '🎵', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80', color: '#8b5cf6' },
    { name: 'Gaming', emoji: '🎮', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80', color: '#ef4444' },
    { name: 'Fitness', emoji: '💪', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80', color: '#f59e0b' },
    { name: 'Food', emoji: '🍕', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', color: '#ec4899' },
    { name: 'Travel', emoji: '✈️', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', color: '#06b6d4' },
];

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const { recommendations, myCreatedActivities, myJoinedActivities, loading } = useSelector((state) => state.activity);

    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [nextActivity, setNextActivity] = useState(null);

    useEffect(() => {
        dispatch(fetchMyProfile());
        dispatch(fetchRecommendations(6));
        dispatch(fetchMyCreatedActivities());
        dispatch(fetchMyJoinedActivities());
    }, [dispatch]);

    useEffect(() => {
        const allActivities = [...(myJoinedActivities || []), ...(myCreatedActivities || [])];
        const upcomingActivities = allActivities
            .filter(a => new Date(a.dateTime) > new Date() && a.status === 'OPEN')
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

        if (upcomingActivities.length > 0) {
            setNextActivity(upcomingActivities[0]);
        }
    }, [myJoinedActivities, myCreatedActivities]);

    useEffect(() => {
        if (!nextActivity) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(nextActivity.dateTime).getTime();
            const distance = target - now;

            if (distance > 0) {
                setCountdown({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [nextActivity]);

    const handleQuickMatch = () => {
        if (recommendations.length > 0) {
            navigate(`/activities/${recommendations[0].id}`);
        } else {
            navigate('/activities');
        }
    };

    return (
        <div className="dashboard-container">
            {/* Premium Hero with Gradient Overlay */}
            <div className="dashboard-hero">
                <div className="hero-bg">
                    <img
                        src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1800&q=80"
                        alt="Celebration"
                        className="hero-bg-image"
                    />
                    <div className="hero-gradient"></div>
                    <div className="hero-particles"></div>
                </div>
                <div className="hero-content-wrapper">
                    <div className="container">
                        <div className="hero-content">
                            <div className="hero-badge">🎉 Welcome back, {user?.fullName?.split(' ')[0]}!</div>
                            <h1 className="hero-title">
                                Find Your Next <span className="gradient-text">Adventure</span>
                            </h1>
                            <p className="hero-subtitle">Connect with amazing people who share your passions. Join activities, make memories.</p>
                            <div className="hero-actions">
                                <button className="btn-hero-primary" onClick={() => navigate('/activities')}>
                                    <span>Explore Activities</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <button className="btn-hero-secondary" onClick={() => navigate('/activities/create')}>
                                    Create Activity
                                </button>
                            </div>

                            {/* Floating Stats */}
                            <div className="hero-stats">
                                <div className="hero-stat">
                                    <span className="stat-number">10K+</span>
                                    <span className="stat-text">Active Users</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="hero-stat">
                                    <span className="stat-number">5K+</span>
                                    <span className="stat-text">Activities</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="hero-stat">
                                    <span className="stat-number">100+</span>
                                    <span className="stat-text">Cities</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container main-content">
                {/* Quick Match - Glassmorphism Card */}
                <div className="quick-match-card">
                    <div className="quick-match-glow"></div>
                    <div className="quick-match-inner">
                        <div className="quick-match-icon">⚡</div>
                        <div className="quick-match-text">
                            <h3>Quick Match</h3>
                            <p>Let AI find your perfect activity match!</p>
                        </div>
                        <button className="quick-match-btn" onClick={handleQuickMatch}>
                            Find Match
                            <span className="btn-arrow">→</span>
                        </button>
                    </div>
                </div>

                {/* Category Showcase */}
                <section className="category-section">
                    <div className="section-header">
                        <h2>🎯 Explore Categories</h2>
                        <p className="text-muted">Find your passion</p>
                    </div>
                    <div className="category-grid">
                        {categoryShowcase.map((cat, index) => (
                            <div
                                key={cat.name}
                                className="category-card"
                                onClick={() => navigate(`/activities?category=${cat.name.toUpperCase()}`)}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <img src={cat.image} alt={cat.name} className="category-image" />
                                <div className="category-overlay">
                                    <span className="category-emoji">{cat.emoji}</span>
                                    <span className="category-name">{cat.name}</span>
                                </div>
                                <div className="category-shine"></div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Stats Banner - Gradient */}
                <div className="stats-banner">
                    <div className="stats-banner-content">
                        <div className="banner-stat">
                            <div className="banner-stat-icon">🎯</div>
                            <div className="banner-stat-value">5,000+</div>
                            <div className="banner-stat-label">Activities Done</div>
                        </div>
                        <div className="banner-stat">
                            <div className="banner-stat-icon">🤝</div>
                            <div className="banner-stat-value">12,000+</div>
                            <div className="banner-stat-label">Connections</div>
                        </div>
                        <div className="banner-stat">
                            <div className="banner-stat-icon">🌍</div>
                            <div className="banner-stat-value">100+</div>
                            <div className="banner-stat-label">Cities</div>
                        </div>
                        <div className="banner-stat">
                            <div className="banner-stat-icon">⭐</div>
                            <div className="banner-stat-value">4.9</div>
                            <div className="banner-stat-label">Avg Rating</div>
                        </div>
                    </div>
                </div>

                {/* Countdown Timer */}
                {nextActivity && (
                    <div className="countdown-card">
                        <div className="countdown-left">
                            <span className="countdown-badge">⏰ Coming Up</span>
                            <h3>{nextActivity.name}</h3>
                        </div>
                        <div className="countdown-timer">
                            <div className="time-block">
                                <span className="time-value">{countdown.days}</span>
                                <span className="time-label">Days</span>
                            </div>
                            <span className="time-sep">:</span>
                            <div className="time-block">
                                <span className="time-value">{countdown.hours}</span>
                                <span className="time-label">Hrs</span>
                            </div>
                            <span className="time-sep">:</span>
                            <div className="time-block">
                                <span className="time-value">{countdown.minutes}</span>
                                <span className="time-label">Min</span>
                            </div>
                            <span className="time-sep">:</span>
                            <div className="time-block">
                                <span className="time-value">{countdown.seconds}</span>
                                <span className="time-label">Sec</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Stats */}
                {profile && (
                    <div className="user-stats-grid">
                        <div className="user-stat-card gradient-1">
                            <div className="stat-icon-wrapper">⭐</div>
                            <div className="stat-content">
                                <span className="stat-value">{profile.averageRating?.toFixed(1) || '0.0'}</span>
                                <span className="stat-label">Your Rating</span>
                            </div>
                        </div>
                        <div className="user-stat-card gradient-2">
                            <div className="stat-icon-wrapper">🎯</div>
                            <div className="stat-content">
                                <span className="stat-value">{profile.totalActivities || 0}</span>
                                <span className="stat-label">Activities</span>
                            </div>
                        </div>
                        <div className="user-stat-card gradient-3">
                            <div className="stat-icon-wrapper">🏆</div>
                            <div className="stat-content">
                                <span className="stat-value">{profile.experienceTag || 'Newbie'}</span>
                                <span className="stat-label">Level</span>
                            </div>
                        </div>
                        <div className="user-stat-card gradient-4">
                            <div className="stat-icon-wrapper">📍</div>
                            <div className="stat-content">
                                <span className="stat-value">{profile.location || '—'}</span>
                                <span className="stat-label">Location</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recommendations */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <div>
                            <h2>🔥 For You</h2>
                            <p className="text-muted">Personalized recommendations</p>
                        </div>
                        <Link to="/activities" className="view-all-link">View All →</Link>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                        </div>
                    ) : recommendations.length === 0 ? (
                        <div className="empty-card">
                            <div className="empty-icon">🎯</div>
                            <h3>No Recommendations Yet</h3>
                            <p>Complete your profile to get personalized suggestions</p>
                            <Link to="/profile/create">
                                <Button variant="primary">Complete Profile</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="activities-grid">
                            {recommendations.map((activity) => (
                                <ActivityCard
                                    key={activity.id}
                                    activity={activity}
                                    onClick={() => navigate(`/activities/${activity.id}`)}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* My Activities */}
                {myCreatedActivities.length > 0 && (
                    <section className="dashboard-section">
                        <div className="section-header">
                            <div>
                                <h2>📋 Your Activities</h2>
                                <p className="text-muted">Activities you organized</p>
                            </div>
                            <Link to="/my-activities" className="view-all-link">Manage →</Link>
                        </div>
                        <div className="activities-grid">
                            {myCreatedActivities.slice(0, 3).map((activity) => (
                                <ActivityCard
                                    key={activity.id}
                                    activity={activity}
                                    onClick={() => navigate(`/activities/${activity.id}`)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA Footer */}
                <div className="cta-footer">
                    <div className="cta-content">
                        <h2>Ready to host an activity?</h2>
                        <p>Bring people together and create memorable experiences</p>
                        <button className="cta-btn" onClick={() => navigate('/activities/create')}>
                            Create Activity
                            <span>→</span>
                        </button>
                    </div>
                    <div className="cta-decoration">
                        <div className="cta-circle cta-circle-1"></div>
                        <div className="cta-circle cta-circle-2"></div>
                        <div className="cta-circle cta-circle-3"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
