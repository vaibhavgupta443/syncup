import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileAPI } from '../../services/apiService';

const initialState = {
    profile: null,
    loading: false,
    error: null,
};

// Async thunks
export const fetchMyProfile = createAsyncThunk(
    'profile/fetchMy',
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileAPI.getMyProfile();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const createProfile = createAsyncThunk(
    'profile/create',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await profileAPI.createProfile(profileData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create profile');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'profile/update',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await profileAPI.updateProfile(profileData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch profile
            .addCase(fetchMyProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchMyProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create profile
            .addCase(createProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(createProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
