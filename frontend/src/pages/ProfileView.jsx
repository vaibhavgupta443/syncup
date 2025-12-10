import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyProfile } from '../redux/slices/profileSlice';
import Button from '../components/Button';
import '../styles/Profile.css';

/**
 * Premium Profile view page with stats, achievements, and activity history.
 */
const ProfileView = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile, loading } = useSelector((state) => state.profile);

    useEffect(() => {
        dispatch(fetchMyProfile());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="flex-center" style={{ minHeight: '60vh' }}>
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="empty-state-box">
                        <div className="empty-icon">👤</div>
                        <h2>No Profile Found</h2>
                        <p className="text-muted">Create your profile to get started on SyncUp</p>
                        <Button variant="primary" size="lg" onClick={() => navigate('/profile/create')}>
                            Create Profile
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const completionRate = profile.totalActivities > 0
        ? Math.round((profile.completedActivities || 0) / profile.totalActivities * 100)
        : 0;

    const activityStreak = profile.activityStreak || 0;
    const trustScore = profile.averageRating ? Math.min(100, Math.round(profile.averageRating * 20)) : 0;

    return (
        <div className="profile-page">
            {/* Header Banner */}
            <div className="profile-banner">
                <div className="banner-overlay"></div>
                <div className="container profile-header-content">
                    <div className="profile-avatar-large">
                        {profile.profilePhotoUrl ? (
                            <img src={profile.profilePhotoUrl} alt={profile.fullName} />
                        ) : (
                            <span className="avatar-initial">{profile.fullName?.charAt(0) || '?'}</span>
                        )}
                        <div className="trust-badge">
                            <span className="trust-score">{trustScore}</span>
                            <span className="trust-label">Trust</span>
                        </div>
                    </div>

                    <div className="profile-header-info">
                        <div className="name-section">
                            <h1>{profile.fullName}</h1>
                            <div className="profile-badges">
                                {profile.experienceTag && (
                                    <span className="experience-badge">{profile.experienceTag}</span>
                                )}
                                {trustScore >= 80 && (
                                    <span className="verified-badge">✓ Trusted</span>
                                )}
                                {activityStreak >= 7 && (
                                    <span className="streak-badge">🔥 {activityStreak} Day Streak</span>
                                )}
                            </div>
                        </div>

                        <div className="profile-quick-stats">
                            <div className="quick-stat">
                                <div className="stat-icon">⭐</div>
                                <div>
                                    <div className="stat-value">{profile.averageRating?.toFixed(1) || '0.0'}</div>
                                    <div className="stat-label">Rating</div>
                                </div>
                            </div>
                            <div className="quick-stat">
                                <div className="stat-icon">🎯</div>
                                <div>
                                    <div className="stat-value">{profile.totalActivities || 0}</div>
                                    <div className="stat-label">Activities</div>
                                </div>
                            </div>
                            <div className="quick-stat">
                                <div className="stat-icon">👥</div>
                                <div>
                                    <div className="stat-value">{profile.connectionsCount || 0}</div>
                                    <div className="stat-label">Connections</div>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="lg"
                            className="edit-profile-btn"
                            onClick={() => navigate('/profile/create')}
                        >
                            ✏️ Edit Profile
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="profile-content-grid">
                    {/* Main Column */}
                    <div className="profile-main-column">
                        {/* About Section */}
                        <div className="profile-card">
                            <div className="card-header">
                                <h2>About Me</h2>
                            </div>
                            <div className="about-content">
                                <p className="bio-text">{profile.bio || 'No bio added yet. Tell others about yourself!'}</p>

                                <div className="info-grid">
                                    <div className="info-item">
                                        <div className="info-icon">📍</div>
                                        <div>
                                            <div className="info-label">Location</div>
                                            <div className="info-value">{profile.location || 'Not specified'}</div>
                                        </div>
                                    </div>

                                    {profile.age && (
                                        <div className="info-item">
                                            <div className="info-icon">🎂</div>
                                            <div>
                                                <div className="info-label">Age</div>
                                                <div className="info-value">{profile.age} years</div>
                                            </div>
                                        </div>
                                    )}

                                    {profile.skillLevel && (
                                        <div className="info-item">
                                            <div className="info-icon">🎯</div>
                                            <div>
                                                <div className="info-label">Skill Level</div>
                                                <div className="info-value">{profile.skillLevel}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {profile.interests && (
                                    <div className="interests-section">
                                        <h3>Interests</h3>
                                        <div className="interests-pills">
                                            {profile.interests.split(',').map((interest, index) => (
                                                <span key={index} className="interest-pill">
                                                    {interest.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Dashboard */}
                        <div className="profile-card">
                            <div className="card-header">
                                <h2>Activity Stats</h2>
                            </div>
                            <div className="stats-dashboard">
                                <div className="stat-card">
                                    <div className="stat-card-icon">✅</div>
                                    <div className="stat-card-value">{completionRate}%</div>
                                    <div className="stat-card-label">Completion Rate</div>
                                    <div className="stat-progress-bar">
                                        <div className="stat-progress-fill" style={{ width: `${completionRate}%` }}></div>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-card-icon">🔥</div>
                                    <div className="stat-card-value">{activityStreak}</div>
                                    <div className="stat-card-label">Day Streak</div>
                                    <div className="stat-card-subtitle">Keep it going!</div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-card-icon">⭐</div>
                                    <div className="stat-card-value">{profile.averageRating?.toFixed(1) || '0.0'}</div>
                                    <div className="stat-card-label">Avg Rating</div>
                                    <div className="rating-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star} className={star <= (profile.averageRating || 0) ? 'star-filled' : 'star-empty'}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-card-icon">🏆</div>
                                    <div className="stat-card-value">{profile.totalActivities || 0}</div>
                                    <div className="stat-card-label">Total Activities</div>
                                    <div className="stat-card-subtitle">joined & hosted</div>
                                </div>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="profile-card">
                            <div className="card-header">
                                <h2>Achievements</h2>
                            </div>
                            <div className="achievements-grid">
                                {profile.totalActivities >= 1 && (
                                    <div className="achievement-badge earned">
                                        <div className="achievement-icon">🎉</div>
                                        <div className="achievement-name">First Activity</div>
                                        <div className="achievement-desc">Joined your first activity</div>
                                    </div>
                                )}

                                {profile.totalActivities >= 5 && (
                                    <div className="achievement-badge earned">
                                        <div className="achievement-icon">🌟</div>
                                        <div className="achievement-name">Social Butterfly</div>
                                        <div className="achievement-desc">Joined 5 activities</div>
                                    </div>
                                )}

                                {activityStreak >= 7 && (
                                    <div className="achievement-badge earned">
                                        <div className="achievement-icon">🔥</div>
                                        <div className="achievement-name">On Fire</div>
                                        <div className="achievement-desc">7-day activity streak</div>
                                    </div>
                                )}

                                {profile.averageRating >= 4.5 && (
                                    <div className="achievement-badge earned">
                                        <div className="achievement-icon">⭐</div>
                                        <div className="achievement-name">Top Rated</div>
                                        <div className="achievement-desc">Maintain 4.5+ rating</div>
                                    </div>
                                )}

                                {/* Locked Achievements */}
                                {profile.totalActivities < 10 && (
                                    <div className="achievement-badge locked">
                                        <div className="achievement-icon">🏅</div>
                                        <div className="achievement-name">Elite Member</div>
                                        <div className="achievement-desc">Join 10 activities</div>
                                    </div>
                                )}

                                {activityStreak < 30 && (
                                    <div className="achievement-badge locked">
                                        <div className="achievement-icon">💎</div>
                                        <div className="achievement-name">Diamond Streak</div>
                                        <div className="achievement-desc">30-day activity streak</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="profile-sidebar">
                        {/* Member Since */}
                        <div className="sidebar-card">
                            <div className="member-since">
                                <div className="member-icon">📅</div>
                                <div>
                                    <div className="member-label">Member Since</div>
                                    <div className="member-date">
                                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="sidebar-card">
                            <h3>Quick Actions</h3>
                            <div className="quick-actions">
                                <button className="action-btn" onClick={() => navigate('/activities/create')}>
                                    <span className="action-icon">➕</span>
                                    Create Activity
                                </button>
                                <button className="action-btn" onClick={() => navigate('/activities')}>
                                    <span className="action-icon">🔍</span>
                                    Browse Activities
                                </button>
                                <button className="action-btn" onClick={() => navigate('/my-activities')}>
                                    <span className="action-icon">📋</span>
                                    My Activities
                                </button>
                            </div>
                        </div>

                        {/* Activity Breakdown */}
                        <div className="sidebar-card">
                            <h3>Activity Breakdown</h3>
                            <div className="activity-breakdown">
                                <div className="breakdown-item">
                                    <div className="breakdown-label">
                                        <span className="breakdown-dot hosted"></span>
                                        Hosted
                                    </div>
                                    <div className="breakdown-value">{profile.hostedActivities || 0}</div>
                                </div>
                                <div className="breakdown-item">
                                    <div className="breakdown-label">
                                        <span className="breakdown-dot joined"></span>
                                        Joined
                                    </div>
                                    <div className="breakdown-value">{profile.joinedActivities || 0}</div>
                                </div>
                                <div className="breakdown-item">
                                    <div className="breakdown-label">
                                        <span className="breakdown-dot completed"></span>
                                        Completed
                                    </div>
                                    <div className="breakdown-value">{profile.completedActivities || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
