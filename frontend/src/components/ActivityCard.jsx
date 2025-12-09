import { Link } from 'react-router-dom';
import '../styles/ActivityCard.css';

/**
 * Activity card component for displaying activity summary.
 */
const ActivityCard = ({ activity, onClick }) => {
    const getStatusBadge = (status) => {
        const statusMap = {
            OPEN: 'badge-open',
            FULL: 'badge-full',
            COMPLETED: 'badge-completed',
            CANCELLED: 'badge-cancelled',
        };
        return statusMap[status] || 'badge-info';
    };

    const formatDate = (dateTime) => {
        return new Date(dateTime).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="activity-card card" onClick={onClick}>
            <div className="activity-card-content">
                <div className="activity-card-header">
                    <span className={`badge ${getStatusBadge(activity.status)}`}>
                        {activity.status}
                    </span>
                    <span className="badge badge-primary">{activity.category}</span>
                </div>

                <h3 className="activity-title">{activity.name}</h3>

                {activity.description && (
                    <p className="activity-card-description">{activity.description}</p>
                )}

                <div className="activity-card-meta">
                    <div className="meta-item">
                        <span className="meta-label">Location</span>
                        <span className="meta-value">{activity.location}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">Date</span>
                        <span className="meta-value">{formatDate(activity.dateTime)}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">Capacity</span>
                        <span className="meta-value">{activity.currentParticipants}/{activity.maxParticipants || '∞'}</span>
                    </div>
                </div>

                {activity.requiredSkillLevel && (
                    <div className="activity-skill">
                        <span className="meta-label">Skill Required</span>
                        <span className="badge badge-info">{activity.requiredSkillLevel}</span>
                    </div>
                )}

                <div className="activity-card-footer">
                    <div className="creator-info">
                        <div className="creator-avatar">
                            {activity.creatorName?.charAt(0)}
                        </div>
                        <div>
                            <p className="creator-name">{activity.creatorName}</p>
                            {activity.creatorRating > 0 && (
                                <p className="creator-rating">{activity.creatorRating.toFixed(1)} rating</p>
                            )}
                        </div>
                    </div>
                    {activity.entryFee > 0 && (
                        <p className="entry-fee">₹{activity.entryFee}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;
