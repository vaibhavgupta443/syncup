import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchRecommendations, fetchMyCreatedActivities, fetchMyJoinedActivities } from '../redux/slices/activitySlice';
import { fetchMyProfile } from '../redux/slices/profileSlice';
import ActivityCard from '../components/ActivityCard';
import Button from '../components/Button';
import '../styles/Dashboard.css';

// Category showcase images
const categoryShowcase = [
    { name: 'Sports', emoji: '⚽', image: 'https://images.unsplash.com/photo-1461896836934- voices-of-the-stadium?w=300&q=80', color: '#10b981' },
    { name: 'Music', emoji: '🎵', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&q=80', color: '#8b5cf6' },
    { name: 'Gaming', emoji: '🎮', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&q=80', color: '#ef4444' },
    { name: 'Fitness', emoji: '💪', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80', color: '#f59e0b' },
    { name: 'Food', emoji: '🍕', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80', color: '#ec4899' },
    { name: 'Travel', emoji: '✈️', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&q=80', color: '#06b6d4' },
];

/**
 * Main dashboard page with enhanced features.
 */
const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const { recommendations, myCreatedActivities, myJoinedActivities, loading } = useSelector((state) => state.activity);

    // Countdown timer state
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [nextActivity, setNextActivity] = useState(null);

    useEffect(() => {
        dispatch(fetchMyProfile());
        dispatch(fetchRecommendations(6));
        dispatch(fetchMyCreatedActivities());
        dispatch(fetchMyJoinedActivities());
    }, [dispatch]);

    // Find next upcoming activity and setup countdown
    useEffect(() => {
        const allActivities = [...(myJoinedActivities || []), ...(myCreatedActivities || [])];
        const upcomingActivities = allActivities
            .filter(a => new Date(a.dateTime) > new Date() && a.status === 'OPEN')
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

        if (upcomingActivities.length > 0) {
            setNextActivity(upcomingActivities[0]);
        }
    }, [myJoinedActivities, myCreatedActivities]);

    // Countdown timer effect
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
            {/* Hero Banner with Background Image */}
            <div className="dashboard-hero">
                <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80"
                    alt="People connecting"
                    className="hero-bg-image"
                />
                <div className="hero-overlay">
                    <div className="container">
                        <div className="hero-content">
                            <p className="hero-label">Welcome back, {user?.fullName?.split(' ')[0]}! 👋</p>
                            <h1 className="hero-title">Find Your Next Adventure</h1>
                            <p className="hero-subtitle">Connect with people who share your passions</p>
                            <div className="hero-actions">
                                <Button variant="primary" size="lg" onClick={() => navigate('/activities')}>
                                    Explore Activities
                                </Button>
                                <Button variant="secondary" size="lg" onClick={() => navigate('/activities/create')}>
                                    Create Activity
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Quick Match CTA */}
                <div className="quick-match-section">
                    <div className="quick-match-image">
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80" alt="Quick Match" />
                    </div>
                    <div className="quick-match-content">
                        <h2>⚡ Quick Match</h2>
                        <p>Let us find the perfect activity for you based on your interests!</p>
                        <button className="quick-match-btn" onClick={handleQuickMatch}>
                            Find My Match →
                        </button>
                    </div>
                </div>

                {/* Category Showcase */}
                <section className="category-showcase">
                    <div className="section-header">
                        <h2>🎯 Browse by Category</h2>
                        <p className="text-muted">Find activities that match your interests</p>
                    </div>
                    <div className="category-grid">
                        {categoryShowcase.map((cat) => (
                            <div
                                key={cat.name}
                                className="category-card"
                                onClick={() => navigate(`/activities?category=${cat.name.toUpperCase()}`)}
                            >
                                <img src={cat.image} alt={cat.name} className="category-image" />
                                <div className="category-overlay" style={{ background: `linear-gradient(135deg, ${cat.color}cc 0%, ${cat.color}99 100%)` }}>
                                    <span className="category-emoji">{cat.emoji}</span>
                                    <span className="category-name">{cat.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Community Stats Banner */}
                <div className="community-banner">
                    <div className="community-bg">
                        <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=80" alt="Community" />
                    </div>
                    <div className="community-content">
                        <div className="community-stat">
                            <div className="community-stat-value">5,000+</div>
                            <div className="community-stat-label">Activities Completed</div>
                        </div>
                        <div className="community-stat">
                            <div className="community-stat-value">12,000+</div>
                            <div className="community-stat-label">Connections Made</div>
                        </div>
                        <div className="community-stat">
                            <div className="community-stat-value">100+</div>
                            <div className="community-stat-label">Cities</div>
                        </div>
                        <div className="community-stat">
                            <div className="community-stat-value">50+</div>
                            <div className="community-stat-label">Activity Types</div>
                        </div>
                    </div>
                </div>

                {/* Countdown Timer */}
                {nextActivity && (
                    <div className="countdown-section">
                        <div className="countdown-banner">
                            <div className="countdown-info">
                                <p className="countdown-title">⏱️ Your next activity</p>
                                <h3>{nextActivity.name}</h3>
                            </div>
                            <div className="countdown-timer">
                                <div className="countdown-unit">
                                    <div className="countdown-value">{countdown.days}</div>
                                    <div className="countdown-label">Days</div>
                                </div>
                                <div className="countdown-unit">
                                    <div className="countdown-value">{countdown.hours}</div>
                                    <div className="countdown-label">Hours</div>
                                </div>
                                <div className="countdown-unit">
                                    <div className="countdown-value">{countdown.minutes}</div>
                                    <div className="countdown-label">Mins</div>
                                </div>
                                <div className="countdown-unit">
                                    <div className="countdown-value">{countdown.seconds}</div>
                                    <div className="countdown-label">Secs</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Stats */}
                {profile && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">⭐</div>
                            <div className="stat-info">
                                <div className="stat-value">{profile.averageRating?.toFixed(1) || '0.0'}</div>
                                <div className="stat-label">Your Rating</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🎯</div>
                            <div className="stat-info">
                                <div className="stat-value">{profile.totalActivities || 0}</div>
                                <div className="stat-label">Activities Done</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🏆</div>
                            <div className="stat-info">
                                <div className="stat-value">{profile.experienceTag || 'Newbie'}</div>
                                <div className="stat-label">Your Level</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📍</div>
                            <div className="stat-info">
                                <div className="stat-value">{profile.location || '—'}</div>
                                <div className="stat-label">Location</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recommendations */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <div>
                            <h2>🔥 Recommended For You</h2>
                            <p className="text-muted">Based on your interests and activity</p>
                        </div>
                        <Link to="/activities">
                            <Button variant="ghost" size="sm">View All →</Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p className="text-muted">Loading recommendations...</p>
                        </div>
                    ) : recommendations.length === 0 ? (
                        <div className="empty-state">
                            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80" alt="Get Started" className="empty-image" />
                            <h3>No Recommendations Yet</h3>
                            <p className="text-muted">Complete your profile to get personalized suggestions</p>
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

                {/* My Created Activities */}
                {myCreatedActivities.length > 0 && (
                    <section className="dashboard-section">
                        <div className="section-header">
                            <div>
                                <h2>📋 Your Activities</h2>
                                <p className="text-muted">Activities you've created</p>
                            </div>
                            <Link to="/my-activities">
                                <Button variant="ghost" size="sm">Manage All →</Button>
                            </Link>
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

                {/* Footer CTA */}
                <div className="footer-cta">
                    <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" alt="Join" className="footer-cta-image" />
                    <div className="footer-cta-content">
                        <h2>Ready to create your own activity?</h2>
                        <p>Bring people together for something amazing</p>
                        <Button variant="primary" size="lg" onClick={() => navigate('/activities/create')}>
                            Create Activity
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
