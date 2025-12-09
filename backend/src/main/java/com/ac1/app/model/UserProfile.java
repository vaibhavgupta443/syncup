package com.ac1.app.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

/**
 * UserProfile entity for storing additional user details like bio, interests,
 * and skill level.
 */
@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    private Long id; // Same as user id

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String location;

    @Enumerated(EnumType.STRING)
    private SkillLevel skillLevel;

    // Interests as a comma-separated string for simplicity
    @Column(columnDefinition = "TEXT")
    private String interests;

    // Aggregate rating (calculated from feedback)
    private Double averageRating = 0.0;

    // Total activities participated
    private Integer totalActivities = 0;

    // Photos (storing URLs)
    @ElementCollection
    @CollectionTable(name = "user_photos", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "photo_url")
    private Set<String> photoUrls = new HashSet<>();
}
