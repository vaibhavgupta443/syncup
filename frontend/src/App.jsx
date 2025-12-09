import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfileForm from './pages/ProfileForm';
import ProfileView from './pages/ProfileView';
import ActivitiesList from './pages/ActivitiesList';
import CreateActivity from './pages/CreateActivity';
import ActivityDetails from './pages/ActivityDetails';
import MyActivities from './pages/MyActivities';
import './index.css';

/**
 * Main App component with routing.
 */
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfileView />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/create"
              element={
                <PrivateRoute>
                  <ProfileForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/activities"
              element={
                <PrivateRoute>
                  <ActivitiesList />
                </PrivateRoute>
              }
            />
            <Route
              path="/activities/create"
              element={
                <PrivateRoute>
                  <CreateActivity />
                </PrivateRoute>
              }
            />
            <Route
              path="/activities/:id"
              element={
                <PrivateRoute>
                  <ActivityDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-activities"
              element={
                <PrivateRoute>
                  <MyActivities />
                </PrivateRoute>
              }
            />

            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;

