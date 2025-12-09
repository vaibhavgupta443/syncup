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
                if (status === 'NOT_JOINED') {
                    setParticipationStatus('NOT_JOINED');
                } else if (status === 'PENDING') {
                    setParticipationStatus('PENDING');
                } else if (status === 'APPROVED') {
                    setParticipationStatus('APPROVED');
                } else if (status === 'REJECTED') {
                    setParticipationStatus('REJECTED');
                } else {
                    setParticipationStatus('NOT_JOINED');
                }
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
            alert('Join request sent successfully! Waiting for organizer approval.');
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
            alert(error.response?.data?.message || 'Failed to approve request');
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
            alert(error.response?.data?.message || 'Failed to reject request');
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

    if (loading) {
        return (
            <div className="activity-details-loading">
                <div className="spinner"></div>
                <p>Loading activity...</p>
            </div>
        );
    }

    if (!currentActivity) {
        return (
            <div className="activity-details-error">
                <h2>Activity not found</h2>
                <Button onClick={() => navigate('/activities')}>Back to Activities</Button>
            </div>
        );
    }

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

    return (
        <div className="activity-details-page">
            {/* Hero Image Section */}
            <div className="activity-hero">
                <img
                    src={getCategoryImage(currentActivity.category)}
                    alt={currentActivity.category}
                    className="activity-hero-image"
                />
                <div className="activity-hero-overlay">
                    <div className="container">
                        <Button variant="ghost" onClick={() => navigate('/activities')} className="back-btn-hero">
                            ← Back to Activities
                        </Button>
                        <div className="hero-badges">
                            <span className={`badge badge-${currentActivity.status.toLowerCase()}`}>
                                {currentActivity.status}
                            </span>
                            <span className="badge badge-primary">{currentActivity.category}</span>
                            {isCreator && <span className="badge badge-info">Your Activity</span>}
                        </div>
                        <h1 className="hero-title">{currentActivity.name}</h1>
                        <div className="hero-meta">
                            <span>📍 {currentActivity.location}</span>
                            <span>📅 {formatDate(currentActivity.dateTime)}</span>
                            <span>👥 {currentActivity.currentParticipants}/{currentActivity.maxParticipants || '∞'} joined</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="activity-details-content">
                    {/* Main Content */}
                    <div className="activity-main">
                        {/* Description Card */}
                        <div className="content-card">
                            <h3>About This Activity</h3>
                            <p className="activity-description">
                                {currentActivity.description || 'No description provided'}
                            </p>
                        </div>

                        {/* Details Grid */}
                        <div className="content-card">
                            <h3>Details</h3>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <div className="detail-icon">📍</div>
                                    <div>
                                        <span className="detail-label">Location</span>
                                        <span className="detail-value">{currentActivity.location}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon">📅</div>
                                    <div>
                                        <span className="detail-label">Date & Time</span>
                                        <span className="detail-value">{formatDate(currentActivity.dateTime)}</span>
                                    </div>
                                </div>
                                {currentActivity.requiredSkillLevel && (
                                    <div className="detail-item">
                                        <div className="detail-icon">🎯</div>
                                        <div>
                                            <span className="detail-label">Skill Level</span>
                                            <span className="detail-value">{currentActivity.requiredSkillLevel}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="detail-item">
                                    <div className="detail-icon">💰</div>
                                    <div>
                                        <span className="detail-label">Entry Fee</span>
                                        <span className="detail-value">
                                            {currentActivity.entryFee > 0 ? `₹${currentActivity.entryFee}` : 'FREE'}
                                        </span>
                                    </div>
                                </div>
                                {(currentActivity.minAge || currentActivity.maxAge) && (
                                    <div className="detail-item">
                                        <div className="detail-icon">🎂</div>
                                        <div>
                                            <span className="detail-label">Age Range</span>
                                            <span className="detail-value">
                                                {currentActivity.minAge || 0} - {currentActivity.maxAge || '∞'} years
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Organizer Card */}
                        <div className="content-card organizer-card">
                            <h3>Organized By</h3>
                            <div className="organizer-info">
                                <div className="organizer-avatar">
                                    {currentActivity.creatorName?.charAt(0)}
                                </div>
                                <div className="organizer-details">
                                    <span className="organizer-name">{currentActivity.creatorName}</span>
                                    {currentActivity.creatorRating > 0 && (
                                        <span className="organizer-rating">⭐ {currentActivity.creatorRating.toFixed(1)} rating</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Participants */}
                        {participants.length > 0 && (
                            <div className="content-card">
                                <h3>Participants ({participants.length})</h3>
                                <div className="participants-grid">
                                    {participants.map((participant) => (
                                        <div key={participant.id} className="participant-chip">
                                            <div className="participant-avatar">
                                                {participant.userName?.charAt(0)}
                                            </div>
                                            <span>{participant.userName}</span>
                                            {currentActivity.status === 'COMPLETED' && isApproved && (
                                                <button
                                                    className="feedback-btn"
                                                    onClick={() => setShowFeedback(participant)}
                                                >
                                                    Rate
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pending Requests (Creator Only) */}
                        {isCreator && pendingRequests.length > 0 && (
                            <div className="content-card requests-card">
                                <h3>Pending Requests ({pendingRequests.length})</h3>
                                <div className="requests-list">
                                    {pendingRequests.map((request) => (
                                        <div key={request.id} className="request-item">
                                            <div className="request-user">
                                                <div className="request-avatar">{request.userName?.charAt(0)}</div>
                                                <div>
                                                    <span className="request-name">{request.userName}</span>
                                                    {request.userRating > 0 && (
                                                        <span className="request-rating">⭐ {request.userRating.toFixed(1)}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="request-actions">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleApprove(request.id)}
                                                    disabled={actionLoading}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleReject(request.id)}
                                                    disabled={actionLoading}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Chat Section */}
                        {canShowChat && (
                            <div className="content-card chat-card">
                                <h3>💬 Activity Chat</h3>
                                <ChatBox activityId={id} />
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="activity-sidebar">
                        <div className="sidebar-card">
                            <div className="price-display">
                                {currentActivity.entryFee > 0 ? (
                                    <>
                                        <span className="price-label">Entry Fee</span>
                                        <span className="price-amount">₹{currentActivity.entryFee}</span>
                                    </>
                                ) : (
                                    <span className="price-free">FREE</span>
                                )}
                            </div>

                            <div className="spots-display">
                                <span className="spots-count">{currentActivity.maxParticipants - currentActivity.currentParticipants}</span>
                                <span className="spots-label">spots left</span>
                            </div>

                            {/* Action Buttons */}
                            {isLoading ? (
                                <div className="spinner spinner-sm"></div>
                            ) : canJoin ? (
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleJoinRequest}
                                    loading={actionLoading}
                                    className="join-btn-full"
                                >
                                    Request to Join
                                </Button>
                            ) : isPending ? (
                                <div className="status-message pending">
                                    <span className="status-icon">⏳</span>
                                    <span>Request Pending</span>
                                    <small>Waiting for organizer</small>
                                </div>
                            ) : isApproved ? (
                                <div className="status-message approved">
                                    <span className="status-icon">✅</span>
                                    <span>You're In!</span>
                                    <small>See you there</small>
                                </div>
                            ) : isRejected ? (
                                <div className="status-message rejected">
                                    <span className="status-icon">❌</span>
                                    <span>Request Declined</span>
                                </div>
                            ) : currentActivity.status !== 'OPEN' ? (
                                <div className="status-message closed">
                                    <span className="status-icon">🚫</span>
                                    <span>Activity Closed</span>
                                </div>
                            ) : null}
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
