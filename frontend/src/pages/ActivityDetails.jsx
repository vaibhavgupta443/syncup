import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivityById } from '../redux/slices/activitySlice';
import { participationAPI } from '../services/apiService';
import Button from '../components/Button';
import ChatBox from '../components/ChatBox';
import FeedbackModal from '../components/FeedbackModal';
import '../styles/ActivityDetails.css';

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
    const [participationStatus, setParticipationStatus] = useState('LOADING'); // LOADING, NOT_JOINED, PENDING, APPROVED, REJECTED
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
            // Backend returns either {status: "NOT_JOINED"} or full participant object with status
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
            // If there's an error, assume not joined
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

    // Determine user status
    const isCreator = currentActivity && user && currentActivity.creatorId === user.userId;
    const isApproved = participationStatus === 'APPROVED';
    const isPending = participationStatus === 'PENDING';
    const isRejected = participationStatus === 'REJECTED';
    const notJoined = participationStatus === 'NOT_JOINED';
    const isLoading = participationStatus === 'LOADING';

    // Can join if: not creator, not already joined (any status), activity is open
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
        <div className="activity-details-container">
            <div className="container">
                <Button variant="ghost" onClick={() => navigate('/activities')} className="back-btn">
                    ← Back to Activities
                </Button>

                <div className="activity-details-card card">
                    {/* Header with Title and Join Button */}
                    <div className="activity-header">
                        <div className="activity-info">
                            <div className="activity-title-row">
                                <h1>{currentActivity.name}</h1>
                                <span className={`badge badge-${currentActivity.status.toLowerCase()}`}>
                                    {currentActivity.status}
                                </span>
                            </div>
                            <p className="activity-category">
                                <span className="badge badge-primary">{currentActivity.category}</span>
                            </p>
                        </div>

                        {/* JOIN BUTTON SECTION */}
                        <div className="header-actions">
                            {isLoading ? (
                                <div className="spinner spinner-sm"></div>
                            ) : isCreator ? (
                                <div className="status-badge creator">
                                    <span className="badge badge-info">Your Activity</span>
                                </div>
                            ) : canJoin ? (
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    onClick={handleJoinRequest}
                                    loading={actionLoading}
                                    className="join-btn"
                                >
                                    ✓ Join This Activity
                                </Button>
                            ) : isPending ? (
                                <div className="status-badge pending">
                                    <span className="badge badge-warning">Request Pending</span>
                                    <p className="status-text">Waiting for organizer approval</p>
                                </div>
                            ) : isApproved ? (
                                <div className="status-badge approved">
                                    <span className="badge badge-success">You're Participating!</span>
                                </div>
                            ) : isRejected ? (
                                <div className="status-badge rejected">
                                    <span className="badge badge-error">Request Declined</span>
                                </div>
                            ) : currentActivity.status !== 'OPEN' ? (
                                <div className="status-badge closed">
                                    <span className="badge badge-error">Activity Closed</span>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="activity-section">
                        <h3>Description</h3>
                        <p className="activity-description">
                            {currentActivity.description || 'No description provided'}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="activity-details-grid">
                        <div className="detail-box">
                            <span className="detail-icon">📍</span>
                            <div>
                                <p className="detail-label">Location</p>
                                <p className="detail-value">{currentActivity.location}</p>
                            </div>
                        </div>

                        <div className="detail-box">
                            <span className="detail-icon">📅</span>
                            <div>
                                <p className="detail-label">Date & Time</p>
                                <p className="detail-value">{formatDate(currentActivity.dateTime)}</p>
                            </div>
                        </div>

                        <div className="detail-box">
                            <span className="detail-icon">👥</span>
                            <div>
                                <p className="detail-label">Participants</p>
                                <p className="detail-value">
                                    {currentActivity.currentParticipants} / {currentActivity.maxParticipants || '∞'}
                                </p>
                            </div>
                        </div>

                        {currentActivity.requiredSkillLevel && (
                            <div className="detail-box">
                                <span className="detail-icon">🎯</span>
                                <div>
                                    <p className="detail-label">Skill Level</p>
                                    <p className="detail-value">{currentActivity.requiredSkillLevel}</p>
                                </div>
                            </div>
                        )}

                        {currentActivity.entryFee > 0 && (
                            <div className="detail-box">
                                <span className="detail-icon">💰</span>
                                <div>
                                    <p className="detail-label">Entry Fee</p>
                                    <p className="detail-value">₹{currentActivity.entryFee}</p>
                                </div>
                            </div>
                        )}

                        {(currentActivity.minAge || currentActivity.maxAge) && (
                            <div className="detail-box">
                                <span className="detail-icon">🎂</span>
                                <div>
                                    <p className="detail-label">Age Range</p>
                                    <p className="detail-value">
                                        {currentActivity.minAge || 0} - {currentActivity.maxAge || '∞'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Creator Info */}
                    <div className="activity-section">
                        <h3>Organized By</h3>
                        <div className="creator-card">
                            <div className="creator-avatar">
                                {currentActivity.creatorName?.charAt(0)}
                            </div>
                            <div>
                                <p className="creator-name">{currentActivity.creatorName}</p>
                                {currentActivity.creatorRating > 0 && (
                                    <p className="creator-rating">{currentActivity.creatorRating.toFixed(1)} rating</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Participants List */}
                    {participants.length > 0 && (
                        <div className="activity-section">
                            <h3>Participants ({participants.length})</h3>
                            <div className="participants-list">
                                {participants.map((participant) => (
                                    <div key={participant.id} className="participant-item">
                                        <div className="participant-info">
                                            <span className="participant-name">{participant.userName}</span>
                                            {participant.userRating > 0 && (
                                                <span className="participant-rating">
                                                    {participant.userRating.toFixed(1)} rating
                                                </span>
                                            )}
                                        </div>
                                        {currentActivity.status === 'COMPLETED' && isApproved && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowFeedback(participant)}
                                            >
                                                Give Feedback
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pending Requests (Creator Only) */}
                    {isCreator && pendingRequests.length > 0 && (
                        <div className="activity-section">
                            <h3>Pending Requests ({pendingRequests.length})</h3>
                            <div className="requests-list">
                                {pendingRequests.map((request) => (
                                    <div key={request.id} className="request-item">
                                        <div>
                                            <p className="request-name">{request.userName}</p>
                                            {request.userRating > 0 && (
                                                <p className="request-rating">{request.userRating.toFixed(1)} rating</p>
                                            )}
                                        </div>
                                        <div className="request-actions">
                                            <Button
                                                variant="secondary"
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

                    {/* Chat */}
                    {canShowChat && (
                        <div className="activity-section">
                            <h3>Activity Chat</h3>
                            <ChatBox activityId={id} />
                        </div>
                    )}
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
