import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import activityReducer from './slices/activitySlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        activity: activityReducer,
    },
});

export default store;
