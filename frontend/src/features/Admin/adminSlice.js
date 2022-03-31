import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ADMIN } from '../../utils/appContents';
import { axiosConfig } from '../../utils/axios';

const initialState = {
    adminInfo: localStorage.getItem(ADMIN)
        ? JSON.parse(localStorage.getItem(ADMIN))
        : null,
    loading: false,
    error: false
};

export const asyncLogin = createAsyncThunk(
    'login/asyncLogin',
    async (loginInfo) => {
        try {
            const {data} = await axiosConfig.post('/auth/admin/signin', loginInfo);
            return data;
        } catch (err) {
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;

            throw new Error(message);
        }
    }
);

const adminSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        logout: () => {
            localStorage.removeItem(ADMIN);
            return {
                adminInfo: null,
                loading: false,
                error: false
            };
        }
    },
    extraReducers: {
        [asyncLogin.pending]: (state) => ({ ...state, loading: true }),
        [asyncLogin.fulfilled]: (state, { payload }) => {
            localStorage.setItem(ADMIN, JSON.stringify(payload));
            return {
                ...state,
                loading: false,
                adminInfo: payload
            };
        },
        [asyncLogin.rejected]: (state, err) => {
            return { ...state, loading: false, error: err.error.message };
        }
    }
});

export const { logout } = adminSlice.actions;

export const getAdminInfo = (state) => state.admin;

export const adminReducer = adminSlice.reducer;