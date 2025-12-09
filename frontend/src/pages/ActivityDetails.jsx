import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivityById } from '../redux/slices/activitySlice';
import { participationAPI } from '../services/apiService';
import Button from '../components/Button';
import ChatBox from '../components/ChatBox';
import FeedbackModal from '../components/FeedbackModal';
import '../styles/ActivityDetails.css';

// Category images from Unsplash - ALL UNIQUE (different from ActivityCard)
const categoryImages = {
    // Sports - hero versions (larger, different photos)
    SPORTS: 'https://images.unsplash.com/photo-1461896836934-56192fce9c14?w=1200&q=80',
    TENNIS: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&q=80',
    FOOTBALL: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&q=80',
    CRICKET: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80',
    BADMINTON: 'https://images.unsplash.com/photo-1613918431703-aa50889e3be5?w=1200&q=80',
    BASKETBALL: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=1200&q=80',

    // Entertainment
    MUSIC: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80',
    STUDY: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
    GAMING: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80',

    // Fitness
    FITNESS: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80',
    YOGA: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
    OUTDOOR: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80',
    HIKING: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80',

    // Social
    SOCIAL: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=80',
    FOOD: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80',

    // Creative
    ART: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1200&q=80',
    DANCE: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=1200&q=80',
    PHOTOGRAPHY: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80',

    // Travel
    TRAVEL: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80',
    ADVENTURE: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1200&q=80',

    DEFAULT: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80'
};

const getCategoryImage = (category) => {
    if (!category) return categoryImages.DEFAULT;
    const upperCategory = category.toUpperCase();
    return categoryImages[upperCategory] || categoryImages.DEFAULT;
};

/**
 * Activity details page with chat and participation management.
 */
const ActivityDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentActivity, loading } = useSelector((state) => state.activity);
    const { user } = useSelector((state) => state.auth);

    const [participants, setParticipants] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [participationStatus, setParticipationStatus] = useState('LOADING');
    const [showFeedback, setShowFeedback] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchActivityById(id));
            loadParticipants();
            checkMyParticipation();
        }
    }, [id, dispatch]);

    const loadParticipants = async () => {
        try {
            const response = await participationAPI.getApprovedParticipants(id);
            setParticipants(response.data || []);
        } catch (error) {
            console.error('Failed to load participants:', error);
            setParticipants([]);
        }
    };

    const loadPendingRequests = async () => {
        try {
            const response = await participationAPI.getPendingRequests(id);
            setPendingRequests(response.data || []);
        } catch (error) {
            console.error('Failed to load pending requests:', error);
            setPendingRequests([]);
        }
    };

    const checkMyParticipation = async () => {
        try {
            const response = await participationAPI.getMyParticipation(id);
            if (response.data) {
                const status = response.data.status;
                setParticipationStatus(status || 'NOT_JOINED');
            } else {
                setParticipationStatus('NOT_JOINED');
            }
        } catch (error) {
            console.error('Error checking participation:', error);
            setParticipationStatus('NOT_JOINED');
        }
    };

    useEffect(() => {
        if (currentActivity && user && currentActivity.creatorId === user.userId) {
            loadPendingRequests();
        }
    }, [currentActivity, user]);

    const handleJoinRequest = async () => {
        setActionLoading(true);
        try {
            await participationAPI.requestToJoin(id);
            setParticipationStatus('PENDING');
            alert('Join request sent successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send join request');
        } finally {
            setActionLoading(false);
        }
    };

    const handleApprove = async (participantId) => {
        setActionLoading(true);
        try {
            await participationAPI.approveRequest(id, participantId);
            await loadPendingRequests();
            await loadParticipants();
            alert('Request approved!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to approve');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (participantId) => {
        setActionLoading(true);
        try {
            await participationAPI.rejectRequest(id, participantId);
            await loadPendingRequests();
            alert('Request rejected');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to reject');
        } finally {
            setActionLoading(false);
        }
    };

    const isCreator = currentActivity && user && currentActivity.creatorId === user.userId;
    const isApproved = participationStatus === 'APPROVED';
    const isPending = participationStatus === 'PENDING';
    const isRejected = participationStatus === 'REJECTED';
    const notJoined = participationStatus === 'NOT_JOINED';
    const isLoading = participationStatus === 'LOADING';
    const canJoin = !isCreator && notJoined && currentActivity?.status === 'OPEN';
    const canShowChat = isApproved || isCreator;

    const formatDate = (dateTime) => {
        return new Date(dateTime).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading activity...</p>
            </div>
        );
    }

    if (!currentActivity) {
        return (
            <div className="error-container">
                <h2>Activity not found</h2>
                <Button onClick={() => navigate('/activities')}>Back to Activities</Button>
            </div>
        );
    }

    return (
        <div className="activity-page">
            {/* Hero Banner with Image */}
            <div className="hero-banner">
                <img
                    src={getCategoryImage(currentActivity.category)}
                    alt={currentActivity.name}
                    className="hero-image"
                />
                <div className="hero-overlay">
                    <div className="container">
                        <button className="back-link" onClick={() => navigate('/activities')}>
                            ← Back to Activities
                        </button>
                        <div className="hero-content">
                            <div className="hero-badges">
                                <span className={`status-badge ${currentActivity.status.toLowerCase()}`}>
                                    {currentActivity.status}
                                </span>
                                <span className="category-badge">{currentActivity.category}</span>
                                {isCreator && <span className="owner-badge">Your Activity</span>}
                            </div>
                            <h1>{currentActivity.name}</h1>
                            <div className="hero-info">
                                <span>📍 {currentActivity.location}</span>
                                <span>📅 {formatDate(currentActivity.dateTime)}</span>
                                <span>👥 {currentActivity.currentParticipants}/{currentActivity.maxParticipants || '∞'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container">
                <div className="content-wrapper">
                    {/* Left Column - Main Info */}
                    <div className="main-column">
                        {/* About Section */}
                        <div className="info-card">
                            <h2>About This Activity</h2>
                            <p>{currentActivity.description || 'No description provided'}</p>
                        </div>

                        {/* Details Section */}
                        <div className="info-card">
                            <h2>Details</h2>
                            <div className="details-list">
                                <div className="detail-row">
                                    <span className="detail-icon">📍</span>
                                    <div>
                                        <strong>Location</strong>
                                        <span>{currentActivity.location}</span>
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-icon">📅</span>
                                    <div>
                                        <strong>Date & Time</strong>
                                        <span>{formatDate(currentActivity.dateTime)}</span>
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-icon">👥</span>
                                    <div>
                                        <strong>Participants</strong>
                                        <span>{currentActivity.currentParticipants} / {currentActivity.maxParticipants || '∞'}</span>
                                    </div>
                                </div>
                                {currentActivity.requiredSkillLevel && (
                                    <div className="detail-row">
                                        <span className="detail-icon">🎯</span>
                                        <div>
                                            <strong>Skill Level</strong>
                                            <span>{currentActivity.requiredSkillLevel}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="detail-row">
                                    <span className="detail-icon">💰</span>
                                    <div>
                                        <strong>Entry Fee</strong>
                                        <span>{currentActivity.entryFee > 0 ? `₹${currentActivity.entryFee}` : 'FREE'}</span>
                                    </div>
                                </div>
                                {(currentActivity.minAge || currentActivity.maxAge) && (
                                    <div className="detail-row">
                                        <span className="detail-icon">🎂</span>
                                        <div>
                                            <strong>Age Range</strong>
                                            <span>{currentActivity.minAge || 0} - {currentActivity.maxAge || '∞'} years</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Organizer Section */}
                        <div className="info-card">
                            <h2>Organized By</h2>
                            <div className="organizer-row">
                                <div className="avatar-circle">{currentActivity.creatorName?.charAt(0)}</div>
                                <div>
                                    <strong>{currentActivity.creatorName}</strong>
                                    {currentActivity.creatorRating > 0 && (
                                        <span className="rating">⭐ {currentActivity.creatorRating.toFixed(1)}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Participants Section */}
                        {participants.length > 0 && (
                            <div className="info-card">
                                <h2>Participants ({participants.length})</h2>
                                <div className="participants-list">
                                    {participants.map((p) => (
                                        <div key={p.id} className="participant-row">
                                            <div className="avatar-small">{p.userName?.charAt(0)}</div>
                                            <span>{p.userName}</span>
                                            {p.userRating > 0 && <span className="rating-small">⭐ {p.userRating.toFixed(1)}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pending Requests - Creator Only */}
                        {isCreator && pendingRequests.length > 0 && (
                            <div className="info-card pending-card">
                                <h2>🔔 Pending Requests ({pendingRequests.length})</h2>
                                <div className="requests-list">
                                    {pendingRequests.map((req) => (
                                        <div key={req.id} className="request-row">
                                            <div className="request-info">
                                                <div className="avatar-small">{req.userName?.charAt(0)}</div>
                                                <div>
                                                    <strong>{req.userName}</strong>
                                                    {req.userRating > 0 && <span className="rating-small">⭐ {req.userRating.toFixed(1)}</span>}
                                                </div>
                                            </div>
                                            <div className="request-buttons">
                                                <button className="approve-btn" onClick={() => handleApprove(req.id)} disabled={actionLoading}>
                                                    ✓ Approve
                                                </button>
                                                <button className="reject-btn" onClick={() => handleReject(req.id)} disabled={actionLoading}>
                                                    ✗ Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Chat Section */}
                        {canShowChat && (
                            <div className="info-card chat-section">
                                <h2>💬 Activity Chat</h2>
                                <ChatBox activityId={id} />
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="sidebar-column">
                        <div className="sidebar-card">
                            {/* Price */}
                            <div className="price-box">
                                {currentActivity.entryFee > 0 ? (
                                    <>
                                        <span className="price-label">Entry Fee</span>
                                        <span className="price-value">₹{currentActivity.entryFee}</span>
                                    </>
                                ) : (
                                    <span className="price-free">FREE</span>
                                )}
                            </div>

                            {/* Spots */}
                            <div className="spots-box">
                                <span className="spots-number">
                                    {currentActivity.maxParticipants ?
                                        currentActivity.maxParticipants - currentActivity.currentParticipants : '∞'}
                                </span>
                                <span className="spots-text">spots left</span>
                            </div>

                            {/* Action Button */}
                            <div className="action-box">
                                {isLoading ? (
                                    <div className="spinner spinner-sm"></div>
                                ) : canJoin ? (
                                    <button
                                        className="join-button"
                                        onClick={handleJoinRequest}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Sending...' : 'Request to Join'}
                                    </button>
                                ) : isPending ? (
                                    <div className="status-box pending">
                                        <span>⏳ Request Pending</span>
                                        <small>Waiting for approval</small>
                                    </div>
                                ) : isApproved ? (
                                    <div className="status-box approved">
                                        <span>✅ You're In!</span>
                                        <small>See you there</small>
                                    </div>
                                ) : isRejected ? (
                                    <div className="status-box rejected">
                                        <span>❌ Request Declined</span>
                                    </div>
                                ) : currentActivity.status !== 'OPEN' ? (
                                    <div className="status-box closed">
                                        <span>🚫 Activity Closed</span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Modal */}
            {showFeedback && (
                <FeedbackModal
                    activityId={id}
                    participant={showFeedback}
                    onClose={() => setShowFeedback(false)}
                />
            )}
        </div>
    );
};

export default ActivityDetails;
