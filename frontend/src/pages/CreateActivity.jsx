import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createActivity, fetchCategories } from '../redux/slices/activitySlice';
import Input from '../components/Input';
import Button from '../components/Button';
import '../styles/CreateActivity.css';

/**
 * Create activity page.
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
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

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

        const activityData = {
            ...formData,
            requiredSkillLevel: formData.requiredSkillLevel || null,
            minAge: formData.minAge ? parseInt(formData.minAge) : null,
            maxAge: formData.maxAge ? parseInt(formData.maxAge) : null,
            maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
            entryFee: parseFloat(formData.entryFee) || 0,
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

                            <Input
                                label="Max Participants"
                                name="maxParticipants"
                                type="number"
                                value={formData.maxParticipants}
                                onChange={handleChange}
                                placeholder="e.g., 10"
                                error={errors.maxParticipants}
                            />
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

                        <Input
                            label="Entry Fee (₹)"
                            name="entryFee"
                            type="number"
                            step="0.01"
                            value={formData.entryFee}
                            onChange={handleChange}
                            placeholder="0"
                        />

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
