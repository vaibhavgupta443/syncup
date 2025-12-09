package com.ac1.app.repository;

import com.ac1.app.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Message entity operations.
 */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findByActivityIdOrderByTimestampAsc(Long activityId, Pageable pageable);

    List<Message> findByActivityIdOrderByTimestampAsc(Long activityId);

    // For polling - get new messages after a timestamp
    List<Message> findByActivityIdAndTimestampAfterOrderByTimestampAsc(Long activityId, LocalDateTime after);
}
