import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createActivity, fetchCategories } from '../redux/slices/activitySlice';
import Input from '../components/Input';
import Button from '../components/Button';
import '../styles/CreateActivity.css';

/**
 * Create activity page with context-aware fields.
 */
const CreateActivity = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories, loading, error } = useSelector((state) => state.activity);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        location: '',
        dateTime: '',
        requiredSkillLevel: '',
        minAge: '',
        maxAge: '',
        maxParticipants: '',
        entryFee: '0',
        // Context-aware fields
        gameType: '',
        positionPreference: '',
        genrePreference: '',
        language: '',
        priceRange: '',
        cuisineType: '',
        dietaryRestrictions: '',
        budgetRange: '',
        subject: '',
        studyStyle: '',
        academicLevel: '',
        tripType: '',
        intensityLevel: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Determine category type for dynamic fields
    const getCategoryType = (category) => {
        const sports = ['Cricket', 'Tennis', 'Football', 'Basketball', 'Badminton', 'Volleyball', 'Swimming', 'Cycling', 'Gym', 'Yoga'];
        const entertainment = ['Movies', 'Music', 'Theater', 'Concert', 'Stand-up Comedy'];
        const food = ['Dining', 'Food', 'Restaurant', 'Cafe'];
        const study = ['Study Group', 'Study', 'Education', 'Learning'];
        const travel = ['Travel', 'Adventure', 'Trekking', 'Hiking', 'Road Trip'];

        if (sports.includes(category)) return 'sports';
        if (entertainment.includes(category)) return 'entertainment';
        if (food.includes(category)) return 'food';
        if (study.includes(category)) return 'study';
        if (travel.includes(category)) return 'travel';
        return 'other';
    };

    const categoryType = getCategoryType(formData.category);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Activity name is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.dateTime) newErrors.dateTime = 'Date and time are required';

        if (formData.dateTime && new Date(formData.dateTime) <= new Date()) {
            newErrors.dateTime = 'Activity date must be in the future';
        }

        if (formData.maxParticipants && formData.maxParticipants < 2) {
            newErrors.maxParticipants = 'At least 2 participants required';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Build categoryData based on category type
        const categoryData = {};
        if (categoryType === 'sports') {
            if (formData.gameType) categoryData.gameType = formData.gameType;
            if (formData.positionPreference) categoryData.positionPreference = formData.positionPreference;
        } else if (categoryType === 'entertainment') {
            if (formData.genrePreference) categoryData.genrePreference = formData.genrePreference;
            if (formData.language) categoryData.language = formData.language;
            if (formData.priceRange) categoryData.priceRange = formData.priceRange;
        } else if (categoryType === 'food') {
            if (formData.cuisineType) categoryData.cuisineType = formData.cuisineType;
            if (formData.dietaryRestrictions) categoryData.dietaryRestrictions = formData.dietaryRestrictions;
            if (formData.budgetRange) categoryData.budgetRange = formData.budgetRange;
        } else if (categoryType === 'study') {
            if (formData.subject) categoryData.subject = formData.subject;
            if (formData.studyStyle) categoryData.studyStyle = formData.studyStyle;
            if (formData.academicLevel) categoryData.academicLevel = formData.academicLevel;
        } else if (categoryType === 'travel') {
            if (formData.tripType) categoryData.tripType = formData.tripType;
            if (formData.intensityLevel) categoryData.intensityLevel = formData.intensityLevel;
            if (formData.budgetRange) categoryData.budgetRange = formData.budgetRange;
        }

        const activityData = {
            name: formData.name,
            category: formData.category,
            description: formData.description,
            location: formData.location,
            dateTime: formData.dateTime,
            requiredSkillLevel: categoryType === 'sports' ? (formData.requiredSkillLevel || null) : null,
            minAge: formData.minAge ? parseInt(formData.minAge) : null,
            maxAge: formData.maxAge ? parseInt(formData.maxAge) : null,
            maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
            entryFee: parseFloat(formData.entryFee) || 0,
            categoryData: Object.keys(categoryData).length > 0 ? JSON.stringify(categoryData) : null,
        };

        try {
            const result = await dispatch(createActivity(activityData)).unwrap();
            navigate(`/activities/${result.id}`);
        } catch (err) {
            console.error('Failed to create activity:', err);
        }
    };

    return (
        <div className="create-activity-container">
            <div className="container">
                <div className="create-activity-card card">
                    <div className="form-header">
                        <h1>Create New Activity</h1>
                        <p className="text-muted">Set up the details for your activity</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="create-activity-form">
                        <Input
                            label="Activity Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Weekend Cricket Match"
                            error={errors.name}
                            required
                        />

                        <div className="form-group">
                            <label htmlFor="category" className="form-label">
                                Category <span style={{ color: 'var(--error)' }}>*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <div className="form-error">{errors.category}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your activity..."
                                className="input"
                                rows="4"
                            />
                        </div>

                        <Input
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g., Central Park, Delhi"
                            error={errors.location}
                            required
                        />

                        <Input
                            label="Date & Time"
                            name="dateTime"
                            type="datetime-local"
                            value={formData.dateTime}
                            onChange={handleChange}
                            error={errors.dateTime}
                            required
                        />

                        {/* Context-Aware Fields - Sports */}
                        {categoryType === 'sports' && (
                            <>
                                <div className="context-fields-header">
                                    <h3>🏅 Sports Details</h3>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="requiredSkillLevel" className="form-label">
                                            Skill Level
                                        </label>
                                        <select
                                            id="requiredSkillLevel"
                                            name="requiredSkillLevel"
                                            value={formData.requiredSkillLevel}
                                            onChange={handleChange}
                                            className="input"
                                        >
                                            <option value="">Any Level</option>
                                            <option value="BEGINNER">Beginner</option>
                                            <option value="INTERMEDIATE">Intermediate</option>
                                            <option value="ADVANCED">Advanced</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="gameType" className="form-label">
                                            Game Type
                                        </label>
                                        <select
                                            id="gameType"
                                            name="gameType"
                                            value={formData.gameType}
                                            onChange={handleChange}
                                            className="input"
                                        >
                                            <option value="">Select Type</option>
                                            <option value="Casual">Casual</option>
                                            <option value="Competitive">Competitive</option>
                                            <option value="Practice">Practice</option>
                                        </select>
                                    </div>
                                </div>

                                <Input
                                    label="Position/Role Preference (Optional)"
                                    name="positionPreference"
                                    value={formData.positionPreference}
                                    onChange={handleChange}
                                    placeholder="e.g., Batsman, Goalkeeper, Forward"
                                />
                            </>
                        )}

                        {/* Context-Aware Fields - Entertainment */}
                        {categoryType === 'entertainment' && (
                            <>
                                <div className="context-fields-header">
                                    <h3>🎬 Entertainment Preferences</h3>
                                </div>
                                <div className="form-row">
                                    <Input
                                        label="Genre/Type"
                                        name="genrePreference"
                                        value={formData.genrePreference}
                                        onChange={handleChange}
                                        placeholder="e.g., Action, Comedy, Jazz"
                                    />

                                    <div className="form-group">
                                        <label htmlFor="language" className="form-label">
                                            Language
                                        </label>
                                        <select
                                            id="language"
                                            name="language"
                                            value={formData.language}
                                            onChange={handleChange}
                                            className="input"
                                        >
                                            <option value="">Any Language</option>
                                            <option value="Hindi">Hindi</option>
                                            <option value="English">English</option>
                                            <option value="Regional">Regional</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="priceRange" className="form-label">
                                        Price Range
                                    </label>
                                    <select
                                        id="priceRange"
                                        name="priceRange"
                                        value={formData.priceRange}
                                        onChange={handleChange}
                                        className="input"
                                    >
                                        <option value="">Any Budget</option>
                                        <option value="Budget">Budget (₹0-500)</option>
                                        <option value="Mid-Range">Mid-Range (₹500-1500)</option>
                                        <option value="Premium">Premium (₹1500+)</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Context-Aware Fields - Food */}
                        {categoryType === 'food' && (
                            <>
                                <div className="context-fields-header">
                                    <h3>🍽️ Dining Preferences</h3>
                                </div>
                                <div className="form-row">
                                    <Input
                                        label="Cuisine Type"
                                        name="cuisineType"
                                        value={formData.cuisineType}
                                        onChange={handleChange}
                                        placeholder="e.g., Italian, Indian, Chinese"
                                    />

                                    <div className="form-group">
                                        <label htmlFor="dietaryRestrictions" className="form-label">
                                            Dietary Preference
                                        </label>
                                        <select
                                            id="dietaryRestrictions"
                                            name="dietaryRestrictions"
                                            value={formData.dietaryRestrictions}
                                            onChange={handleChange}
                                            className="input"
                                        >
                                            <option value="">Any</option>
                                            <option value="Vegetarian">Vegetarian</option>
                                            <option value="Non-Vegetarian">Non-Vegetarian</option>
                                            <option value="Vegan">Vegan</option>
                                            <option value="Jain">Jain</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="budgetRange" className="form-label">
                                        Budget Range (per person)
                                    </label>
                                    <select
                                        id="budgetRange"
                                        name="budgetRange"
                                        value={formData.budgetRange}
                                        onChange={handleChange}
                                        className="input"
                                    >
                                        <option value="">Any Budget</option>
                                        <option value="Budget">Budget (₹0-300)</option>
                                        <option value="Mid-Range">Mid-Range (₹300-800)</option>
                                        <option value="Premium">Premium (₹800+)</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Context-Aware Fields - Study */}
                        {categoryType === 'study' && (
                            <>
                                <div className="context-fields-header">
                                    <h3>📚 Study Group Details</h3>
                                </div>
                                <div className="form-row">
                                    <Input
                                        label="Subject/Topic"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="e.g., Mathematics, UPSC, Web Development"
                                    />

                                    <div className="form-group">
                                        <label htmlFor="studyStyle" className="form-label">
                                            Study Style
                                        </label>
                                        <select
                                            id="studyStyle"
                                            name="studyStyle"
                                            value={formData.studyStyle}
                                            onChange={handleChange}
                                            className="input"
                                        >
                                            <option value="">Any Style</option>
                                            <option value="Silent Study">Silent Study</option>
                                            <option value="Group Discussion">Group Discussion</option>
                                            <option value="Mix">Mix of Both</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="academicLevel" className="form-label">
                                        Academic Level
                                    </label>
                                    <select
                                        id="academicLevel"
                                        name="academicLevel"
                                        value={formData.academicLevel}
                                        onChange={handleChange}
                                        className="input"
                                    >
                                        <option value="">Any Level</option>
                                        <option value="School">School</option>
                                        <option value="Undergraduate">Undergraduate</option>
                                        <option value="Postgraduate">Postgraduate</option>
                                        <option value="Professional">Professional/Competitive Exams</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Context-Aware Fields - Travel */}
                        {categoryType === 'travel' && (
                            <>
                                <div className="context-fields-header">
                                    <h3>✈️ Travel Details</h3>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="tripType" className="form-label">
                                            Trip Type
                                        </label>
                                        <select
                                            id="tripType"
                                            name="tripType"
                                            value={formData.tripType}
                                            onChange={handleChange}
                                            className="input"
                                        >
                                            <option value="">Select Type</option>
                                            <option value="Day Trip">Day Trip</option>
                                            <option value="Weekend">Weekend Getaway</option>
                                            <option value="Week-long">Week-long Trip</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="intensityLevel" className="form-label">
                                            Intensity Level
                                        </label>
                                        <select
                                            id="intensityLevel"
                                            name="intensityLevel"
                                            value={formData.intensityLevel}
                                            onChange={handleChange}
                                            className="input"
                                        >
                                            <option value="">Any Level</option>
                                            <option value="Relaxed">Relaxed</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="Adventurous">Adventurous</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="budgetRange" className="form-label">
                                        Budget Range (per person)
                                    </label>
                                    <select
                                        id="budgetRange"
                                        name="budgetRange"
                                        value={formData.budgetRange}
                                        onChange={handleChange}
                                        className="input"
                                    >
                                        <option value="">Any Budget</option>
                                        <option value="Budget">Budget (₹0-3000)</option>
                                        <option value="Mid-Range">Mid-Range (₹3000-10000)</option>
                                        <option value="Premium">Premium (₹10000+)</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Common Fields */}
                        <div className="context-fields-header">
                            <h3>👥 Participant Details</h3>
                        </div>

                        <div className="form-row">
                            <Input
                                label="Min Age"
                                name="minAge"
                                type="number"
                                value={formData.minAge}
                                onChange={handleChange}
                                placeholder="e.g., 18"
                            />

                            <Input
                                label="Max Age"
                                name="maxAge"
                                type="number"
                                value={formData.maxAge}
                                onChange={handleChange}
                                placeholder="e.g., 50"
                            />
                        </div>

                        <div className="form-row">
                            <Input
                                label="Max Participants"
                                name="maxParticipants"
                                type="number"
                                value={formData.maxParticipants}
                                onChange={handleChange}
                                placeholder="e.g., 10"
                                error={errors.maxParticipants}
                            />

                            <Input
                                label="Entry Fee (₹)"
                                name="entryFee"
                                type="number"
                                step="0.01"
                                value={formData.entryFee}
                                onChange={handleChange}
                                placeholder="0"
                            />
                        </div>

                        <div className="form-actions">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate('/activities')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                loading={loading}
                            >
                                Create Activity
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateActivity;
