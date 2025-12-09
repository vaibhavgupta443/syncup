import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchRecommendations, fetchMyCreatedActivities, fetchMyJoinedActivities } from '../redux/slices/activitySlice';
import { fetchMyProfile } from '../redux/slices/profileSlice';
import ActivityCard from '../components/ActivityCard';
import Button from '../components/Button';
import '../styles/Dashboard.css';

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

    // Handle Quick Match - navigate to first recommended activity
    const handleQuickMatch = () => {
        if (recommendations.length > 0) {
            navigate(`/activities/${recommendations[0].id}`);
        } else {
            navigate('/activities');
        }
    };

    return (
        <div className="dashboard-container">
            <div className="container">
                {/* Welcome Section */}
                <div className="dashboard-header fade-in">
                    <div>
                        <p className="welcome-label">Welcome back</p>
                        <h1>{user?.fullName}</h1>
                        <p className="text-muted">Here's what's happening in your network</p>
                    </div>
                    <Button variant="primary" onClick={() => navigate('/activities/create')}>
                        + New Activity
                    </Button>
                </div>

                {/* Quick Match CTA - USP Feature */}
                <div className="quick-match-section fade-in">
                    <div className="quick-match-content">
                        <h2>⚡ Quick Match</h2>
                        <p>Jump into the perfect activity for you with one click!</p>
                    </div>
                    <button className="quick-match-btn" onClick={handleQuickMatch}>
                        Find My Match →
                    </button>
                </div>

                {/* Community Stats Banner - USP Feature */}
                <div className="community-banner fade-in">
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

                {/* Countdown Timer - USP Feature */}
                {nextActivity && (
                    <div className="countdown-section fade-in">
                        <p className="countdown-title">⏱️ Your next activity: <strong>{nextActivity.name}</strong></p>
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
                                <div className="countdown-label">Minutes</div>
                            </div>
                            <div className="countdown-unit">
                                <div className="countdown-value">{countdown.seconds}</div>
                                <div className="countdown-label">Seconds</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Stats */}
                {profile && (
                    <div className="stats-grid fade-in">
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">⭐ Rating</span>
                            </div>
                            <div className="stat-value">{profile.averageRating?.toFixed(1) || '0.0'}</div>
                            <div className="stat-subtitle">out of 5.0</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">🎯 Activities</span>
                            </div>
                            <div className="stat-value">{profile.totalActivities || 0}</div>
                            <div className="stat-subtitle">completed</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">🏆 Experience</span>
                            </div>
                            <div className="stat-value">{profile.experienceTag || 'Newbie'}</div>
                            <div className="stat-subtitle">level</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">📍 Location</span>
                            </div>
                            <div className="stat-value">{profile.location || '—'}</div>
                            <div className="stat-subtitle">base</div>
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
                            <Button variant="ghost" size="sm">View All</Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p className="text-muted">Loading recommendations...</p>
                        </div>
                    ) : recommendations.length === 0 ? (
                        <div className="empty-state card">
                            <h3>No Recommendations Yet</h3>
                            <p className="text-muted">
                                Complete your profile to get personalized activity suggestions
                            </p>
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
                                <Button variant="ghost" size="sm">Manage All</Button>
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
            </div>
        </div>
    );
};

export default Dashboard;
