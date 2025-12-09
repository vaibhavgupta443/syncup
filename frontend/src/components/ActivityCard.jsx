import '../styles/ActivityCard.css';

// Category images from Unsplash - ALL UNIQUE
const categoryImages = {
    // Sports
    SPORTS: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80',
    TENNIS: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&q=80',
    FOOTBALL: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&q=80',
    CRICKET: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80',
    BADMINTON: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80',
    BASKETBALL: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',

    // Entertainment & Hobbies
    MUSIC: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    STUDY: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
    GAMING: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80',
    READING: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',

    // Fitness & Outdoor
    FITNESS: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
    YOGA: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&q=80',
    OUTDOOR: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&q=80',
    HIKING: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80',
    CYCLING: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=400&q=80',

    // Social & Lifestyle  
    SOCIAL: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=400&q=80',
    FOOD: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
    COOKING: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80',

    // Creative
    ART: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80',
    PHOTOGRAPHY: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
    DANCE: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&q=80',

    // Travel & Adventure
    TRAVEL: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80',
    ADVENTURE: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&q=80',

    // Default
    DEFAULT: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&q=80'
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
