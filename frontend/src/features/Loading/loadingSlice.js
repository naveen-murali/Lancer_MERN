import { createSlice, createAction } from '@reduxjs/toolkit';

const initialState = {
    loadingState: false
};

export const showLoading = createAction('showLoading');
export const hideLoading = createAction('hideLoading');

const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {},
    extraReducers: {
        [showLoading]: () => ({ loadingState: true }),
        [hideLoading]: () => ({ loadingState: false })
    }
});

export const getLoadingState = (state) => state.loading.loadingState;
export const loadingReducer = loadingSlice.reducer;