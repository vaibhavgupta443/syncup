import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyProfile, createProfile } from '../redux/slices/profileSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import '../styles/Profile.css';

/**
 * Profile creation/edit page.
 */
const ProfileForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile, loading, error } = useSelector((state) => state.profile);
    const [isEdit, setIsEdit] = useState(false);

    const [formData, setFormData] = useState({
        bio: '',
        location: '',
        skillLevel: '',
        interests: '',
    });

    useEffect(() => {
        if (profile) {
            setIsEdit(true);
            setFormData({
                bio: profile.bio || '',
                location: profile.location || '',
                skillLevel: profile.skillLevel || '',
                interests: profile.interests || '',
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(createProfile(formData)).unwrap();
            navigate('/dashboard');
        } catch (err) {
            console.error('Profile creation failed:', err);
        }
    };

    return (
        <div className="profile-container">
            <div className="container">
                <div className="profile-card card fade-in">
                    <h1>{isEdit ? 'Edit Profile' : 'Create Your Profile'} ✨</h1>
                    <p className="text-muted mb-3">
                        Tell us about yourself to get personalized recommendations
                    </p>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label htmlFor="bio" className="form-label">
                                Bio / About Me
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                                className="input"
                                rows="4"
                            />
                        </div>

                        <Input
                            label="Location"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g., Delhi, Mumbai"
                        />

                        <div className="form-group">
                            <label htmlFor="skillLevel" className="form-label">
                                Skill Level
                            </label>
                            <select
                                id="skillLevel"
                                name="skillLevel"
                                value={formData.skillLevel}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="">Select Skill Level</option>
                                <option value="BEGINNER">Beginner</option>
                                <option value="INTERMEDIATE">Intermediate</option>
                                <option value="ADVANCED">Advanced</option>
                            </select>
                        </div>

                        <Input
                            label="Interests (comma-separated)"
                            name="interests"
                            type="text"
                            value={formData.interests}
                            onChange={handleChange}
                            placeholder="e.g., Cricket, Movies, Gym"
                        />

                        <div className="profile-form-actions">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate('/dashboard')}
                            >
                                Skip for Now
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                            >
                                {isEdit ? 'Update Profile' : 'Create Profile'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;
