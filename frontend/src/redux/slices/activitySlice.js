import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { activityAPI } from '../../services/apiService';

const initialState = {
    activities: [],
    currentActivity: null,
    myCreatedActivities: [],
    myJoinedActivities: [],
    recommendations: [],
    categories: [],
    totalPages: 0,
    currentPage: 0,
    loading: false,
    error: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk(
    'activity/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await activityAPI.getCategories();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

export const createActivity = createAsyncThunk(
    'activity/create',
    async (activityData, { rejectWithValue }) => {
        try {
            const response = await activityAPI.createActivity(activityData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create activity');
        }
    }
);

export const fetchActivities = createAsyncThunk(
    'activity/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await activityAPI.getAllActivities(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch activities');
        }
    }
);

export const fetchFilteredActivities = createAsyncThunk(
    'activity/fetchFiltered',
    async (filters, { rejectWithValue }) => {
        try {
            const response = await activityAPI.getFilteredActivities(filters);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch filtered activities');
        }
    }
);

export const fetchActivityById = createAsyncThunk(
    'activity/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await activityAPI.getActivity(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch activity');
        }
    }
);

export const fetchMyCreatedActivities = createAsyncThunk(
    'activity/fetchMyCreated',
    async (_, { rejectWithValue }) => {
        try {
            const response = await activityAPI.getMyCreatedActivities();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch created activities');
        }
    }
);

export const fetchMyJoinedActivities = createAsyncThunk(
    'activity/fetchMyJoined',
    async (_, { rejectWithValue }) => {
        try {
            const response = await activityAPI.getMyJoinedActivities();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch joined activities');
        }
    }
);

export const fetchRecommendations = createAsyncThunk(
    'activity/fetchRecommendations',
    async (limit = 10, { rejectWithValue }) => {
        try {
            const response = await activityAPI.getRecommendations(limit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations');
        }
    }
);

const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {
        clearCurrentActivity: (state) => {
            state.currentActivity = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch categories
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            // Create activity
            .addCase(createActivity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createActivity.fulfilled, (state, action) => {
                state.loading = false;
                state.activities.unshift(action.payload);
            })
            .addCase(createActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch all activities
            .addCase(fetchActivities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActivities.fulfilled, (state, action) => {
                state.loading = false;
                state.activities = action.payload.content;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.number;
            })
            .addCase(fetchActivities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch filtered activities
            .addCase(fetchFilteredActivities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilteredActivities.fulfilled, (state, action) => {
                state.loading = false;
                state.activities = action.payload.content;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.number;
            })
            .addCase(fetchFilteredActivities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch activity by ID
            .addCase(fetchActivityById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActivityById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentActivity = action.payload;
            })
            .addCase(fetchActivityById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch my created activities
            .addCase(fetchMyCreatedActivities.fulfilled, (state, action) => {
                state.myCreatedActivities = action.payload;
            })
            // Fetch my joined activities
            .addCase(fetchMyJoinedActivities.fulfilled, (state, action) => {
                state.myJoinedActivities = action.payload;
            })
            // Fetch recommendations
            .addCase(fetchRecommendations.fulfilled, (state, action) => {
                state.recommendations = action.payload;
            });
    },
});

export const { clearCurrentActivity, clearError } = activitySlice.actions;
export default activitySlice.reducer;
