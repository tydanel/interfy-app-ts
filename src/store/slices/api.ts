import { createSlice } from "@reduxjs/toolkit";

const apiSlice = createSlice({
    name: 'api',
    initialState: {
        status: null,
        endpoint: null,
        isFetching: false,
        error: null
    },
    reducers: {
        setStatus: (state, { payload }) => {
            state.status = payload;
        },
        setEndpoint: (state, { payload }) => {
            state.endpoint = payload;
        },
        setError: (state, { payload }) => {
            state.error = payload;
        },
        setIsFetching: state => {
            state.isFetching = true;
        },
        setDoneFetching: state => {
            state.isFetching = false;
        },
        clearRequest: state => {
            state.status = null;
            state.endpoint = null;
            state.isFetching = false;
        },
        clearError: state => {
            state.error = null;
        }
    }
});


export const { actions, reducer } = apiSlice;
export const { 
    setStatus, 
    setEndpoint, 
    setIsFetching, 
    setError, 
    setDoneFetching, 
    clearRequest, 
    clearError
} = apiSlice.actions;

