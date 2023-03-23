import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'editor',
    initialState: {
        html: '',
        json: ''
    },
    reducers: {
        updateHtml(state, { payload }) {
            state.html = payload;
        },
        updateJson(state, { payload }) {
            state.json = payload;
        },
        clearEditorState(state) {
            state.html = '';
            state.json = {};
        }
    }
});


export const { reducer, actions } = authSlice;