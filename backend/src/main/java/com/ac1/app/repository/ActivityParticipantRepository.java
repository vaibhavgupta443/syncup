package com.ac1.app.repository;

import com.ac1.app.model.ActivityParticipant;
import com.ac1.app.model.ParticipationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository for ActivityParticipant entity.
 */
@Repository
public interface ActivityParticipantRepository extends JpaRepository<ActivityParticipant, Long> {

    List<ActivityParticipant> findByActivityId(Long activityId);

    List<ActivityParticipant> findByActivityIdAndStatus(Long activityId, ParticipationStatus status);

    List<ActivityParticipant> findByUserId(Long userId);

    List<ActivityParticipant> findByUserIdAndStatus(Long userId, ParticipationStatus status);

    Optional<ActivityParticipant> findByActivityIdAndUserId(Long activityId, Long userId);

    boolean existsByActivityIdAndUserId(Long activityId, Long userId);

    long countByActivityIdAndStatus(Long activityId, ParticipationStatus status);
}
