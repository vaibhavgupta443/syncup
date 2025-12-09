package com.ac1.app.repository;

import com.ac1.app.model.Activity;
import com.ac1.app.model.ActivityStatus;
import com.ac1.app.model.SkillLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Activity entity with filtering capabilities.
 */
@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    Page<Activity> findByDeletedFalse(Pageable pageable);

    Page<Activity> findByStatusAndDeletedFalse(ActivityStatus status, Pageable pageable);

    List<Activity> findByCreatorIdAndDeletedFalse(Long creatorId);

    @Query("SELECT a FROM Activity a WHERE a.deleted = false " +
            "AND (:category IS NULL OR a.category = :category) " +
            "AND (:skillLevel IS NULL OR a.requiredSkillLevel = :skillLevel) " +
            "AND (:location IS NULL OR a.location LIKE %:location%) " +
            "AND (:status IS NULL OR a.status = :status)")
    Page<Activity> findWithFilters(
            @Param("category") String category,
            @Param("skillLevel") SkillLevel skillLevel,
            @Param("location") String location,
            @Param("status") ActivityStatus status,
            Pageable pageable);

    // For recommendations - find by category
    List<Activity> findByCategoryInAndStatusAndDeletedFalse(List<String> categories, ActivityStatus status);
}
