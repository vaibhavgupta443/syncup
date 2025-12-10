package com.ac1.app.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Activity entity representing an event or activity that users can create and
 * join.
 */
@Entity
@Table(name = "activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // Category from predefined list or custom
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    private LocalDateTime dateTime;

    @Enumerated(EnumType.STRING)
    private SkillLevel requiredSkillLevel;

    private Integer minAge;
    private Integer maxAge;

    private Integer maxParticipants;
    private Integer currentParticipants = 0;

    private Double entryFee;

    // Category-specific data stored as JSON
    // For sports: gameType, positionPreference
    // For entertainment: genrePreference, language, priceRange
    // For food: cuisineType, dietaryRestrictions, budgetRange
    // For study: subject, studyStyle, academicLevel
    // For travel: tripType, intensityLevel, budgetRange
    @Column(columnDefinition = "JSON")
    private String categoryData;

    @Enumerated(EnumType.STRING)
    private ActivityStatus status = ActivityStatus.OPEN;

    // Creator of the activity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    // Activity images
    @ElementCollection
    @CollectionTable(name = "activity_images", joinColumns = @JoinColumn(name = "activity_id"))
    @Column(name = "image_url")
    private Set<String> imageUrls = new HashSet<>();

    // Participants
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ActivityParticipant> participants = new HashSet<>();

    // Messages/Chat for this activity
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Message> messages = new HashSet<>();

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    private boolean deleted = false;
}
