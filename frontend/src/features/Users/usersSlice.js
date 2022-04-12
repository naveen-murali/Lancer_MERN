import { createSlice } from '@reduxjs/toolkit';
import { blockAsyncUser, getAsyncUsers, unblockAsyncUser } from './usersActions';

const initialState = {
    users: {
        users: [],
        loading: false,
        error: ''
    },
    blockUser: {
        loading: false,
        success: false,
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

        [blockAsyncUser.pending]: (state) =>
            ({ ...state, blockUser: { loading: true, success: false } }),

        [blockAsyncUser.fulfilled]: (state, { payload }) => {
            const users = state.users.users;
            return ({
                ...state,
                users: {
                    ...state.users,
                    users: users.map(user => ({
                        ...user, isBlocked: user._id === payload ? true : user.isBlocked
                    }))
                },
                blockUser: {
                    ...state.blockUser,
                    loading: false,
                    success: true
                }
            });
        },

        [blockAsyncUser.rejected]: (state, { error }) =>
            ({ ...state, unblockUser: { ...state.unblockUser, loading: false, error: error.message } }),

        [unblockAsyncUser.pending]: (state) =>
            ({ ...state, unblockUser: { loading: true, success: false } }),

        [unblockAsyncUser.fulfilled]: (state, { payload }) => {
            const users = state.users.users;
            return ({
                ...state,
                users: {
                    ...state.users,
                    users: users.map(user => ({
                        ...user, isBlocked: user._id === payload ? false : user.isBlocked
                    }))
                },
                unblockUser: {
                    ...state.unblockUser,
                    loading: false,
                    success: true
                }
            });
        },

        [unblockAsyncUser.rejected]: (state, { error }) =>
            ({ ...state, unblockUser: { ...state.unblockUser, loading: false, error: error.message } }),
    }
});

export const getUsers = (state) => state.users.users;
export const usersReducer = usersSlice.reducer;