import { configureStore } from '@reduxjs/toolkit';
import { adminReducer } from '../features/Admin/adminSlice';
import { categoriesReducers } from '../features/Category/categorySlice';
import { loadingReducer } from '../features/Loading/loadingSlice';
import { mainAlertReducer } from '../features/MainAlert/mainAlertSlice';
import { usersReducer } from '../features/Users/usersSlice';

export const store = configureStore({
  reducer: {
    mainAlert: mainAlertReducer,
    loading: loadingReducer,
    admin: adminReducer,
    users: usersReducer,
    categories: categoriesReducers
  },
});
