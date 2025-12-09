package com.ac1.app.repository;

import com.ac1.app.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Feedback entity operations.
 */
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByActivityId(Long activityId);

    List<Feedback> findByRevieweeId(Long revieweeId);

    List<Feedback> findByReviewerId(Long reviewerId);

    boolean existsByActivityIdAndReviewerIdAndRevieweeId(Long activityId, Long reviewerId, Long revieweeId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.reviewee.id = :userId")
    Double getAverageRatingForUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.reviewee.id = :userId")
    Long getTotalFeedbackCountForUser(@Param("userId") Long userId);
}
