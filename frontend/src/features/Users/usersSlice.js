import { createSlice } from '@reduxjs/toolkit';
import { getAsyncUsers } from './usersActions';

const initialState = {
    users: {
        users: [],
        loading: false,
        error: ''
    }
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: {
        [getAsyncUsers.pending]: (state) =>
            ({ ...state, users: { ...state.users, loading: true } }),

        [getAsyncUsers.fulfilled]: (state, { payload }) =>
            ({ ...state, users: { ...state.users, loading: false, ...payload } }),

        [getAsyncUsers.rejected]: (state, { error }) =>
            ({ ...state, users: { ...state.users, loading: false, error: error.message } }),
    }
});

export const getUsers = (state) => state.users.users;
export const usersReducer = usersSlice.reducer;