import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyProfile } from '../redux/slices/profileSlice';
import Button from '../components/Button';
import '../styles/Profile.css';

/**
 * Profile view page.
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
            <div className="profile-container">
                <div className="container">
                    <div className="flex-center" style={{ minHeight: '50vh' }}>
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="profile-container">
                <div className="container">
                    <div className="empty-state card">
                        <h2>No Profile Found</h2>
                        <p className="text-muted">Create your profile to get started</p>
                        <Button variant="primary" onClick={() => navigate('/profile/create')}>
                            Create Profile
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-view-container">
            <div className="container">
                <div className="profile-header">
                    <div className="profile-header-content">
                        <div className="profile-avatar">
                            {profile.profilePhotoUrl ? (
                                <img src={profile.profilePhotoUrl} alt={profile.fullName} />
                            ) : (
                                <span>{profile.fullName?.charAt(0)}</span>
                            )}
                        </div>

                        <div className="profile-info">
                            <h1>{profile.fullName}</h1>
                            <p className="text-muted">{profile.email}</p>

                            <div className="profile-stats">
                                <div className="stat-item">
                                    <div className="stat-value">
                                        {profile.averageRating?.toFixed(1) || '0.0'}
                                    </div>
                                    <div className="stat-label">Rating</div>
                                </div>

                                <div className="stat-item">
                                    <div className="stat-value">{profile.totalActivities || 0}</div>
                                    <div className="stat-label">Activities</div>
                                </div>

                                <div className="stat-item">
                                    <div className="stat-value">{profile.experienceTag || 'Newbie'}</div>
                                    <div className="stat-label">Level</div>
                                </div>
                            </div>

                            <Button variant="outline" onClick={() => navigate('/profile/create')}>
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="profile-details card">
                    <h2>About</h2>
                    <div className="detail-item">
                        <span>📝</span>
                        <strong>Bio:</strong> {profile.bio || 'No bio added'}
                    </div>

                    <div className="detail-item">
                        <span>📍</span>
                        <strong>Location:</strong> {profile.location || 'Not specified'}
                    </div>

                    <div className="detail-item">
                        <span>🎯</span>
                        <strong>Skill Level:</strong> {profile.skillLevel || 'Not specified'}
                    </div>

                    <div className="detail-item">
                        <span>💡</span>
                        <strong>Interests:</strong> {profile.interests || 'None added'}
                    </div>

                    {profile.age && (
                        <div className="detail-item">
                            <span>🎂</span>
                            <strong>Age:</strong> {profile.age}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
