import { createSlice } from "@reduxjs/toolkit";
import { getAsyncServices } from './servicesAction';

const initialState = {
    services: {
        loading: false,
        services: [],
        error: ""
    }
};

const servicesSlice = createSlice({
    name: "services",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAsyncServices.pending, (state, _) => {
                state.services = {
                    ...state.services,
                    loading: true
                };
            })
            .addCase(getAsyncServices.fulfilled, (state, { payload }) => {
                state.services = {
                    ...state.services,
                    loading: false,
                    ...payload
                };
            })
            .addCase(getAsyncServices.rejected, (state, { error }) => {
                state.services = {
                    ...state.services,
                    loading: false,
                    error: error.message
                };
            });
    }
});

export const servicesReducers = servicesSlice.reducer;
export const getServices = (state) => state.services.services;