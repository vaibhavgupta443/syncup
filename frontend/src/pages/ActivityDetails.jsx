import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivityById } from '../redux/slices/activitySlice';
import { participationAPI } from '../services/apiService';
import Button from '../components/Button';
import ChatBox from '../components/ChatBox';
import FeedbackModal from '../components/FeedbackModal';
import '../styles/ActivityDetails.css';

// Category images from Unsplash
const categoryImages = {
    SPORTS: 'https://images.unsplash.com/photo-1461896836934- voices-of-the-stadium?w=1200&q=80',
    TENNIS: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80',
    FOOTBALL: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
    CRICKET: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80',
    BADMINTON: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&q=80',
    MUSIC: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80',
    STUDY: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80',
    GAMING: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&q=80',
    FITNESS: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
    OUTDOOR: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80',
    HIKING: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80',
    SOCIAL: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
    FOOD: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
    ART: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80',
    TRAVEL: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
    YOGA: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
    DANCE: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=1200&q=80',
    DEFAULT: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80'
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
