import api from './api';

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

// Profile API
export const profileAPI = {
    getMyProfile: () => api.get('/profiles/me'),
    getProfile: (userId) => api.get(`/profiles/${userId}`),
    createProfile: (profileData) => api.post('/profiles', profileData),
    updateProfile: (profileData) => api.put('/profiles', profileData),
};

// Activity API
export const activityAPI = {
    getCategories: () => api.get('/activities/categories'),
    createActivity: (activityData) => api.post('/activities', activityData),
    getActivity: (id) => api.get(`/activities/${id}`),
    getAllActivities: (params) => api.get('/activities', { params }),
    getFilteredActivities: (filters) => api.get('/activities/filter', { params: filters }),
    getMyCreatedActivities: () => api.get('/activities/my-created'),
    getMyJoinedActivities: () => api.get('/activities/my-joined'),
    getRecommendations: (limit = 10) => api.get('/activities/recommendations', { params: { limit } }),
    updateActivity: (id, activityData) => api.put(`/activities/${id}`, activityData),
    completeActivity: (id) => api.post(`/activities/${id}/complete`),
    deleteActivity: (id) => api.delete(`/activities/${id}`),
};

// Participation API
export const participationAPI = {
    requestToJoin: (activityId) => api.post(`/activities/${activityId}/participants/join`),
    getPendingRequests: (activityId) => api.get(`/activities/${activityId}/participants/pending`),
    getApprovedParticipants: (activityId) => api.get(`/activities/${activityId}/participants`),
    getMyParticipation: (activityId) => api.get(`/activities/${activityId}/participants/my-status`),
    approveRequest: (activityId, participantId) =>
        api.post(`/activities/${activityId}/participants/${participantId}/approve`),
    rejectRequest: (activityId, participantId) =>
        api.post(`/activities/${activityId}/participants/${participantId}/reject`),
};

// Chat API
export const chatAPI = {
    sendMessage: (activityId, content) =>
        api.post(`/activities/${activityId}/chat`, { content }),
    getMessages: (activityId) => api.get(`/activities/${activityId}/chat`),
    pollNewMessages: (activityId, after) =>
        api.get(`/activities/${activityId}/chat/poll`, { params: { after } }),
};

// Feedback API
export const feedbackAPI = {
    submitFeedback: (activityId, feedbackData) =>
        api.post(`/activities/${activityId}/feedback`, feedbackData),
    getFeedbackForActivity: (activityId) => api.get(`/activities/${activityId}/feedback`),
    getFeedbackForUser: (userId) => api.get(`/users/${userId}/feedback`),
    getMyGivenFeedback: () => api.get('/feedback/my-given'),
};
