import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyCreatedActivities, fetchMyJoinedActivities } from '../redux/slices/activitySlice';
import ActivityCard from '../components/ActivityCard';
import Button from '../components/Button';
import '../styles/MyActivities.css';

/**
 * Premium My Activities page with insights and filters.
 */
const MyActivities = () => {
    const dispatch = useDispatch();
    const { myCreatedActivities, myJoinedActivities } = useSelector((state) => state.activity);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchMyCreatedActivities());
        dispatch(fetchMyJoinedActivities());
    }, [dispatch]);

    const allActivities = [...myCreatedActivities, ...myJoinedActivities];
    const upcomingActivities = allActivities.filter(a => new Date(a.dateTime) > new Date());
    const pastActivities = allActivities.filter(a => new Date(a.dateTime) <= new Date());

    const getFilteredActivities = () => {
        let activities = [];
        switch (activeTab) {
            case 'created':
                activities = myCreatedActivities;
                break;
            case 'joined':
                activities = myJoinedActivities;
                break;
            case 'upcoming':
                activities = upcomingActivities;
                break;
            case 'past':
                activities = pastActivities;
                break;
            default:
                activities = allActivities;
        }

        if (searchTerm) {
            return activities.filter(a =>
                a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.category?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return activities;
    };

    const filteredActivities = getFilteredActivities();

    return (
        <div className="my-activities-page">
            <div className="container">
                {/* Header with Insights */}
                <div className="page-header">
                    <div>
                        <h1>My Activities</h1>
                        <p className="header-subtitle">Manage and track all your activities</p>
                    </div>
                    <Link to="/activities/create">
                        <Button variant="primary" size="lg">➕ Create Activity</Button>
                    </Link>
                </div>

                {/* Insights Dashboard */}
                <div className="insights-dashboard">
                    <div className="insight-card">
                        <div className="insight-icon">📊</div>
                        <div>
                            <div className="insight-value">{allActivities.length}</div>
                            <div className="insight-label">Total Activities</div>
                        </div>
                    </div>

                    <div className="insight-card">
                        <div className="insight-icon">🎯</div>
                        <div>
                            <div className="insight-value">{myCreatedActivities.length}</div>
                            <div className="insight-label">Hosted</div>
                        </div>
                    </div>

                    <div className="insight-card">
                        <div className="insight-icon">🤝</div>
                        <div>
                            <div className="insight-value">{myJoinedActivities.length}</div>
                            <div className="insight-label">Joined</div>
                        </div>
                    </div>

                    <div className="insight-card">
                        <div className="insight-icon">📅</div>
                        <div>
                            <div className="insight-value">{upcomingActivities.length}</div>
                            <div className="insight-label">Upcoming</div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="filters-section">
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All <span className="tab-count">{allActivities.length}</span>
                        </button>
                        <button
                            className={`tab ${activeTab === 'created' ? 'active' : ''}`}
                            onClick={() => setActiveTab('created')}
                        >
                            Created <span className="tab-count">{myCreatedActivities.length}</span>
                        </button>
                        <button
                            className={`tab ${activeTab === 'joined' ? 'active' : ''}`}
                            onClick={() => setActiveTab('joined')}
                        >
                            Joined <span className="tab-count">{myJoinedActivities.length}</span>
                        </button>
                        <button
                            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setActiveTab('upcoming')}
                        >
                            Upcoming <span className="tab-count">{upcomingActivities.length}</span>
                        </button>
                        <button
                            className={`tab ${activeTab === 'past' ? 'active' : ''}`}
                            onClick={() => setActiveTab('past')}
                        >
                            Past <span className="tab-count">{pastActivities.length}</span>
                        </button>
                    </div>

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="🔍 Search activities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {/* Activities Grid */}
                {filteredActivities.length === 0 ? (
                    <div className="empty-state-card">
                        <div className="empty-icon">
                            {activeTab === 'created' ? '📝' : activeTab === 'joined' ? '🤝' : '📋'}
                        </div>
                        <h3>
                            {activeTab === 'created' ? 'No Activities Created' :
                                activeTab === 'joined' ? 'No Activities Joined' :
                                    searchTerm ? 'No Results Found' : 'No Activities Yet'}
                        </h3>
                        <p>
                            {activeTab === 'created' ? 'Start by creating your first activity!' :
                                activeTab === 'joined' ? 'Explore and join activities in your area' :
                                    searchTerm ? 'Try a different search term' : 'Get started by creating or joining an activity'}
                        </p>
                        <div className="empty-actions">
                            <Link to="/activities/create">
                                <Button variant="primary">Create Activity</Button>
                            </Link>
                            <Link to="/activities">
                                <Button variant="outline">Browse Activities</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="activities-grid">
                        {filteredActivities.map((activity) => (
                            <ActivityCard
                                key={activity.id}
                                activity={activity}
                                onClick={() => (window.location.href = `/activities/${activity.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyActivities;
