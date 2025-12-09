import { useState } from 'react';
import { feedbackAPI } from '../services/apiService';
import Button from './Button';
import '../styles/FeedbackModal.css';

/**
 * Feedback modal for rating participants.
 */
const FeedbackModal = ({ activityId, participant, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        setSubmitting(true);
        try {
            await feedbackAPI.submitFeedback(activityId, {
                revieweeId: participant.userId,
                rating,
                comment,
            });
            alert('Feedback submitted successfully!');
            onClose();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal feedback-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Give Feedback</h2>
                    <button className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    <p className="feedback-participant">
                        Rating for: <strong>{participant.userName}</strong>
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Rating</label>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star ${star <= (hoverRating || rating) ? 'star-filled' : 'star-empty'
                                            }`}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            <p className="rating-text">
                                {rating === 0
                                    ? 'Select a rating'
                                    : rating === 1
                                        ? 'Poor'
                                        : rating === 2
                                            ? 'Fair'
                                            : rating === 3
                                                ? 'Good'
                                                : rating === 4
                                                    ? 'Very Good'
                                                    : 'Excellent'}
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="comment" className="form-label">
                                Comment (Optional)
                            </label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience..."
                                className="input"
                                rows="4"
                            />
                        </div>

                        <div className="modal-actions">
                            <Button type="button" variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" loading={submitting}>
                                Submit Feedback
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
