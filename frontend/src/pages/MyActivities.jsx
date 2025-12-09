import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyCreatedActivities, fetchMyJoinedActivities } from '../redux/slices/activitySlice';
import ActivityCard from '../components/ActivityCard';
import Button from '../components/Button';
import '../styles/MyActivities.css';

/**
 * My activities page showing created and joined activities.
 */
const MyActivities = () => {
    const dispatch = useDispatch();
    const { myCreatedActivities, myJoinedActivities } = useSelector((state) => state.activity);

    useEffect(() => {
        dispatch(fetchMyCreatedActivities());
        dispatch(fetchMyJoinedActivities());
    }, [dispatch]);

    return (
        <div className="my-activities-container">
            <div className="container">
                <div className="my-activities-header">
                    <h1>My Activities 📋</h1>
                    <Link to="/activities/create">
                        <Button variant="primary">+ Create Activity</Button>
                    </Link>
                </div>

                {/* Created Activities */}
                <section className="activities-section">
                    <h2>Created by Me ({myCreatedActivities.length})</h2>
                    {myCreatedActivities.length === 0 ? (
                        <div className="empty-state card">
                            <p className="text-muted">You haven't created any activities yet</p>
                            <Link to="/activities/create">
                                <Button variant="primary">Create Your First Activity</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="activities-grid">
                            {myCreatedActivities.map((activity) => (
                                <ActivityCard
                                    key={activity.id}
                                    activity={activity}
                                    onClick={() => (window.location.href = `/activities/${activity.id}`)}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Joined Activities */}
                <section className="activities-section">
                    <h2>Joined Activities ({myJoinedActivities.length})</h2>
                    {myJoinedActivities.length === 0 ? (
                        <div className="empty-state card">
                            <p className="text-muted">You haven't joined any activities yet</p>
                            <Link to="/activities">
                                <Button variant="primary">Explore Activities</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="activities-grid">
                            {myJoinedActivities.map((activity) => (
                                <ActivityCard
                                    key={activity.id}
                                    activity={activity}
                                    onClick={() => (window.location.href = `/activities/${activity.id}`)}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default MyActivities;
