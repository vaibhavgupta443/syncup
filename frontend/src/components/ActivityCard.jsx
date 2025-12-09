import '../styles/ActivityCard.css';

// Category images from Unsplash
const categoryImages = {
    SPORTS: 'https://images.unsplash.com/photo-1461896836934- voices-of-the-stadium?w=400&q=80',
    MUSIC: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80',
    STUDY: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
    GAMING: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80',
    FITNESS: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
    OUTDOOR: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80',
    SOCIAL: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
    FOOD: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
    ART: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80',
    TRAVEL: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80',
    DEFAULT: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80'
};

// Category emojis as fallback
const categoryEmojis = {
    SPORTS: '⚽',
    MUSIC: '🎵',
    STUDY: '📚',
    GAMING: '🎮',
    FITNESS: '💪',
    OUTDOOR: '🏔️',
    SOCIAL: '🎉',
    FOOD: '🍕',
    ART: '🎨',
    TRAVEL: '✈️',
    DEFAULT: '🎯'
};

/**
 * Activity card component for displaying activity summary with images.
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

    const getCategoryImage = (category) => {
        return categoryImages[category?.toUpperCase()] || categoryImages.DEFAULT;
    };

    const getCategoryEmoji = (category) => {
        return categoryEmojis[category?.toUpperCase()] || categoryEmojis.DEFAULT;
    };

    return (
        <div className="activity-card card" onClick={onClick}>
            {/* Category Image Header */}
            <div className="activity-card-image-placeholder">
                {getCategoryEmoji(activity.category)}
            </div>

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
                        <span className="meta-label">📍 Location</span>
                        <span className="meta-value">{activity.location}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">📅 Date</span>
                        <span className="meta-value">{formatDate(activity.dateTime)}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">👥 Spots</span>
                        <span className="meta-value">{activity.currentParticipants}/{activity.maxParticipants || '∞'}</span>
                    </div>
                </div>

                {activity.requiredSkillLevel && (
                    <div className="activity-skill">
                        <span className="meta-label">Level Required</span>
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
                    {activity.entryFee > 0 ? (
                        <p className="entry-fee">₹{activity.entryFee}</p>
                    ) : (
                        <p className="entry-fee entry-fee-free">FREE</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;
