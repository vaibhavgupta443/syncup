import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchActivities, fetchFilteredActivities, fetchCategories } from '../redux/slices/activitySlice';
import ActivityCard from '../components/ActivityCard';
import Button from '../components/Button';
import '../styles/ActivitiesList.css';

/**
 * Activities list page with filtering.
 */
const ActivitiesList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { activities, categories, loading, totalPages, currentPage } = useSelector((state) => state.activity);

    const [filters, setFilters] = useState({
        category: '',
        skillLevel: '',
        location: '',
        status: 'OPEN',
        page: 0,
        size: 12,
    });

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (filters.category || filters.skillLevel || filters.location) {
            dispatch(fetchFilteredActivities(filters));
        } else {
            dispatch(fetchActivities({ page: filters.page, size: filters.size }));
        }
    }, [dispatch, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value, page: 0 }));
    };

    const handleClearFilters = () => {
        setFilters({
            category: '',
            skillLevel: '',
            location: '',
            status: 'OPEN',
            page: 0,
            size: 12,
        });
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    return (
        <div className="activities-list-container">
            <div className="container">
                <div className="activities-header">
                    <h1>Explore Activities 🔍</h1>
                    <Button variant="primary" onClick={() => navigate('/activities/create')}>
                        + Create Activity
                    </Button>
                </div>

                {/* Filters */}
                <div className="filters-section card">
                    <div className="filters-grid">
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="input"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Skill Level</label>
                            <select
                                name="skillLevel"
                                value={filters.skillLevel}
                                onChange={handleFilterChange}
                                className="input"
                            >
                                <option value="">All Levels</option>
                                <option value="BEGINNER">Beginner</option>
                                <option value="INTERMEDIATE">Intermediate</option>
                                <option value="ADVANCED">Advanced</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={filters.location}
                                onChange={handleFilterChange}
                                placeholder="Enter location..."
                                className="input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="input"
                            >
                                <option value="">All Status</option>
                                <option value="OPEN">Open</option>
                                <option value="FULL">Full</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="filters-actions">
                        <Button variant="ghost" onClick={handleClearFilters}>
                            Clear Filters
                        </Button>
                    </div>
                </div>

                {/* Activities Grid */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading activities...</p>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="empty-state card">
                        <h3>No activities found</h3>
                        <p className="text-muted">Try adjusting your filters or create a new activity!</p>
                        <Button variant="primary" onClick={() => navigate('/activities/create')}>
                            Create Activity
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="activities-grid">
                            {activities.map((activity) => (
                                <ActivityCard
                                    key={activity.id}
                                    activity={activity}
                                    onClick={() => navigate(`/activities/${activity.id}`)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <Button
                                    variant="ghost"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                >
                                    Previous
                                </Button>
                                <span className="pagination-info">
                                    Page {currentPage + 1} of {totalPages}
                                </span>
                                <Button
                                    variant="ghost"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages - 1}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ActivitiesList;
