import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchRecommendations, fetchMyCreatedActivities } from '../redux/slices/activitySlice';
import { fetchMyProfile } from '../redux/slices/profileSlice';
import ActivityCard from '../components/ActivityCard';
import Button from '../components/Button';
import '../styles/Dashboard.css';

/**
 * Main dashboard page showing recommendations and user stats.
 */
const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);
    const { recommendations, myCreatedActivities, loading } = useSelector((state) => state.activity);

    useEffect(() => {
        dispatch(fetchMyProfile());
        dispatch(fetchRecommendations(6));
        dispatch(fetchMyCreatedActivities());
    }, [dispatch]);

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

                {/* Quick Stats */}
                {profile && (
                    <div className="stats-grid fade-in">
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">Rating</span>
                            </div>
                            <div className="stat-value">{profile.averageRating?.toFixed(1) || '0.0'}</div>
                            <div className="stat-subtitle">out of 5.0</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">Activities</span>
                            </div>
                            <div className="stat-value">{profile.totalActivities || 0}</div>
                            <div className="stat-subtitle">completed</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">Experience</span>
                            </div>
                            <div className="stat-value">{profile.experienceTag || 'Newbie'}</div>
                            <div className="stat-subtitle">level</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">Location</span>
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
                            <h2>Recommended For You</h2>
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
                                <h2>Your Activities</h2>
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
