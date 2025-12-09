import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchRecommendations, fetchMyCreatedActivities, fetchMyJoinedActivities } from '../redux/slices/activitySlice';
import { fetchMyProfile } from '../redux/slices/profileSlice';
import ActivityCard from '../components/ActivityCard';
import Button from '../components/Button';
import '../styles/Dashboard.css';

// Category showcase with VERIFIED WORKING images
const categoryShowcase = [
    { name: 'Sports', emoji: '⚽', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80', color: '#10b981' },
    { name: 'Music', emoji: '🎵', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', color: '#8b5cf6' },
    { name: 'Gaming', emoji: '🎮', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80', color: '#ef4444' },
    { name: 'Fitness', emoji: '💪', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80', color: '#f59e0b' },
    { name: 'Food', emoji: '🍕', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', color: '#ec4899' },
    { name: 'Travel', emoji: '✈️', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80', color: '#06b6d4' },
];

// Featured hosts with images
const featuredHosts = [
    { name: 'Alex', rating: 4.9, activities: 45, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
    { name: 'Sarah', rating: 4.8, activities: 32, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
    { name: 'Mike', rating: 4.9, activities: 28, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
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
            {/* Hero with Background Image */}
            <div className="dashboard-hero">
                <div className="hero-bg">
                    <img
                        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1800&q=80"
                        alt="Friends having fun"
                        className="hero-bg-image"
                    />
                    <div className="hero-gradient"></div>
                </div>
                <div className="hero-content-wrapper">
                    <div className="container">
                        <div className="hero-content">
                            <div className="hero-badge">🎉 Welcome back, {user?.fullName?.split(' ')[0]}!</div>
                            <h1 className="hero-title">
                                Find Your <span className="gradient-text">Perfect Match</span>
                            </h1>
                            <p className="hero-subtitle">Connect with amazing people. Join activities you love. Make memories together.</p>
                            <div className="hero-actions">
                                <button className="btn-hero-primary" onClick={() => navigate('/activities')}>
                                    <span>Explore Activities</span>
                                    <span>→</span>
                                </button>
                                <button className="btn-hero-secondary" onClick={() => navigate('/activities/create')}>
                                    Create Activity
                                </button>
                            </div>
                        </div>

                        {/* Hero Side Image */}
                        <div className="hero-side-image">
                            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80" alt="Team collaboration" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container main-content">
                {/* Quick Match with Background */}
                <div className="quick-match-card">
                    <img
                        src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80"
                        alt="Quick Match background"
                        className="quick-match-bg"
                    />
                    <div className="quick-match-overlay"></div>
                    <div className="quick-match-inner">
                        <div className="quick-match-icon">⚡</div>
                        <div className="quick-match-text">
                            <h3>Quick Match</h3>
                            <p>Let AI find your perfect activity match!</p>
                        </div>
                        <button className="quick-match-btn" onClick={handleQuickMatch}>
                            Find Match →
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
                            >
                                <img src={cat.image} alt={cat.name} className="category-image" />
                                <div className="category-overlay">
                                    <span className="category-emoji">{cat.emoji}</span>
                                    <span className="category-name">{cat.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Stats Banner with Background */}
                <div className="stats-banner">
                    <img
                        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"
                        alt="Community"
                        className="stats-banner-bg"
                    />
                    <div className="stats-banner-overlay"></div>
                    <div className="stats-banner-content">
                        <div className="banner-stat">
                            <div className="banner-stat-value">5,000+</div>
                            <div className="banner-stat-label">Activities Done</div>
                        </div>
                        <div className="banner-stat">
                            <div className="banner-stat-value">12,000+</div>
                            <div className="banner-stat-label">Connections</div>
                        </div>
                        <div className="banner-stat">
                            <div className="banner-stat-value">100+</div>
                            <div className="banner-stat-label">Cities</div>
                        </div>
                        <div className="banner-stat">
                            <div className="banner-stat-value">4.9</div>
                            <div className="banner-stat-label">Avg Rating</div>
                        </div>
                    </div>
                </div>

                {/* Featured Hosts */}
                <section className="hosts-section">
                    <div className="section-header">
                        <h2>⭐ Top Hosts</h2>
                        <p className="text-muted">Learn from the best</p>
                    </div>
                    <div className="hosts-grid">
                        {featuredHosts.map((host) => (
                            <div key={host.name} className="host-card">
                                <img src={host.image} alt={host.name} className="host-image" />
                                <div className="host-info">
                                    <h4>{host.name}</h4>
                                    <p>⭐ {host.rating} • {host.activities} activities</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

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
                        <div className="user-stat-card stat-1">
                            <div className="stat-icon-wrapper">⭐</div>
                            <div className="stat-content">
                                <span className="stat-value">{profile.averageRating?.toFixed(1) || '0.0'}</span>
                                <span className="stat-label">Your Rating</span>
                            </div>
                        </div>
                        <div className="user-stat-card stat-2">
                            <div className="stat-icon-wrapper">🎯</div>
                            <div className="stat-content">
                                <span className="stat-value">{profile.totalActivities || 0}</span>
                                <span className="stat-label">Activities</span>
                            </div>
                        </div>
                        <div className="user-stat-card stat-3">
                            <div className="stat-icon-wrapper">🏆</div>
                            <div className="stat-content">
                                <span className="stat-value">{profile.experienceTag || 'Newbie'}</span>
                                <span className="stat-label">Level</span>
                            </div>
                        </div>
                        <div className="user-stat-card stat-4">
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
                            <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=300&q=80" alt="Get Started" className="empty-image" />
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

                {/* CTA Footer with Image */}
                <div className="cta-footer">
                    <img
                        src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&q=80"
                        alt="Friends at dinner"
                        className="cta-footer-bg"
                    />
                    <div className="cta-footer-overlay"></div>
                    <div className="cta-content">
                        <h2>Ready to host an activity?</h2>
                        <p>Bring people together and create memorable experiences</p>
                        <button className="cta-btn" onClick={() => navigate('/activities/create')}>
                            Create Activity →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
