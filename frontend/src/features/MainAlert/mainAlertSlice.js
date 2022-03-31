import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    variant: '',
    show: false,
    message: ''
};

const mainAlertSlice = createSlice({
    name: 'mainAlert',
    initialState,
    reducers: {
        hideAlert: () => initialState,
        showSuccessAlert: (_, { payload }) =>
            ({ variant: 'success', show: true, message: payload }),
        showErrorAlert: (_, { payload }) =>
            ({ variant: 'error', show: true, message: payload }),
    }
});

export const { hideAlert, showSuccessAlert, showErrorAlert } = mainAlertSlice.actions;
export const getMainAlert = (state) => state.mainAlert;
export const mainAlertReducer = mainAlertSlice.reducer;