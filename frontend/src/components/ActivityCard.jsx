import '../styles/ActivityCard.css';

// Category images from Unsplash (high quality)
const categoryImages = {
    SPORTS: 'https://images.unsplash.com/photo-1461896836934- voices-of-the-stadium?w=400&q=80',
    TENNIS: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&q=80',
    FOOTBALL: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80',
    CRICKET: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80',
    BADMINTON: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80',
    MUSIC: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80',
    STUDY: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
    GAMING: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80',
    FITNESS: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
    OUTDOOR: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80',
    HIKING: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80',
    SOCIAL: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
    FOOD: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
    ART: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80',
    TRAVEL: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80',
    YOGA: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
    DANCE: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400&q=80',
    DEFAULT: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80'
};

/**
 * Activity card component with real images.
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
        if (!category) return categoryImages.DEFAULT;
        return categoryImages[category.toUpperCase()] || categoryImages.DEFAULT;
    };

    return (
        <div className="activity-card" onClick={onClick}>
            {/* Real Image Header */}
            <div className="card-image-wrapper">
                <img
                    src={getCategoryImage(activity.category)}
                    alt={activity.category || 'Activity'}
                    className="card-image"
                />
                <div className="card-image-overlay">
                    <div className="card-badges">
                        <span className={`status-tag ${activity.status?.toLowerCase()}`}>
                            {activity.status}
                        </span>
                        <span className="category-tag">{activity.category}</span>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <h3 className="card-title">{activity.name}</h3>

                {activity.description && (
                    <p className="card-description">{activity.description}</p>
                )}

                <div className="card-info">
                    <div className="info-row">
                        <span className="info-icon">📍</span>
                        <span>{activity.location}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-icon">📅</span>
                        <span>{formatDate(activity.dateTime)}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-icon">👥</span>
                        <span>{activity.currentParticipants}/{activity.maxParticipants || '∞'} spots</span>
                    </div>
                </div>

                {activity.requiredSkillLevel && (
                    <div className="skill-badge">
                        <span className="skill-label">Level:</span>
                        <span className="skill-value">{activity.requiredSkillLevel}</span>
                    </div>
                )}

                <div className="card-footer">
                    <div className="host-info">
                        <div className="host-avatar">
                            {activity.creatorName?.charAt(0)}
                        </div>
                        <div className="host-details">
                            <span className="host-name">{activity.creatorName}</span>
                            {activity.creatorRating > 0 && (
                                <span className="host-rating">⭐ {activity.creatorRating.toFixed(1)}</span>
                            )}
                        </div>
                    </div>
                    <div className="price-tag">
                        {activity.entryFee > 0 ? (
                            <span className="price">₹{activity.entryFee}</span>
                        ) : (
                            <span className="price free">FREE</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;
