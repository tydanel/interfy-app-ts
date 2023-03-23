import { createSlice } from "@reduxjs/toolkit";
import { addProducts } from './products';

import createDebugLogger from "../../lib/logger";
import * as api from '../../lib/api';

import { selectAuthToken } from "../selectors";

const log = createDebugLogger('store:auth');

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        user: null,
        status: 'not-authenticated',
        serverAddress: null,
        company_key: null,
        errorMessage: null,
    },
    reducers: {
        setToken(state, { payload }) {
            state.token = payload;
        },
        setUser(state, { payload }) {
            state.user = payload;
        },
        setStatus(state, { payload }) {
            state.status = payload;
        },
        setCompanyKey(state, { payload }) {
            state.company_key = payload;
        },
        setError(state, { payload }) {
            state.errorMessage = payload;
        },
        unsetError(state) {
            state.errorMessage = null;
        },
        setServerAddress(state, { payload }) {
            state.serverAddress = payload;
        },
        unset(state) {
            state.status = 'not-authenticated';
            state.user = null;
            state.token = null;
            state.errorMessage = null;
            state.company_key = null;
            state.serverAddress = null;
        }
    }
});


export const { actions, reducer } = authSlice;
export const { 
    setServerAddress,
    setCompanyKey,
    setStatus, 
    setError, 
    setToken, 
    setUser, 
    unset,
} = authSlice.actions;


export function authenticate({email, company, server, password, refresh = false}) {
    return async (dispatch, getState) => {
        const token = selectAuthToken(getState());
        
        
        try {
            dispatch(setStatus('requesting-authentication'));
            dispatch(setServerAddress(server));
            let result;
            
            if ( refresh ) {
                result = await api.post('refresh', '', token);
                log('refresh', result, company)
            }
            else {
                result = await api.post('login', { email, password });
            }

            
            dispatch(setStatus('processing-response'));
            if ( !result.data  ) {
                if ( result.message ) {
                    dispatch(setStatus('authentication-failed'));
                    setTimeout(() => {
                        dispatch(setStatus('not-authenticed'));
                    }, 1500);
                    throw new Error(result.message);
                }
            }


            const { data : loginData } = result;

            dispatch(setStatus('selecting-company-data'));
            for ( const item of loginData ) {
                const itemName = item.company.settings.name.toLowerCase().trim();
                const selectedName = company.toLowerCase().trim();

                if ( itemName == selectedName ) {
                    // Set user and authentication token                    //
                    dispatch(setToken(item.token.token));
                    dispatch(setUser(item.user));
                    dispatch(setCompanyKey(item.company.company_key));
                    
                    // Saving token to local storage
                    saveAuthDataToStorage(item.token.token, selectedName, server);
                    
                    dispatch(setStatus('authenticated'));

                    dispatch(addProducts(item.company.products));
                    
                    return;
                }
            }
        } catch (error) {
            log(error);
            dispatch(setError(error.message));
        }
    }
}
export function logout() {
    return (dispatch) => {
        removeAuthDataFromStorage();
        dispatch(unset());
    }
}
export function loadAuthDataFromStorage() {
    return (dispatch) => {
        const token = localStorage.getItem('auth-token');
        const company  = localStorage.getItem('auth-company');
        const server = localStorage.getItem('auth-server');
        if ( token ) {
            try {
                // dispatch(setServerAddress(server));
                dispatch(setToken(token));
                dispatch(authenticate({ refresh: true, company, server }))
            } catch(error) {
                console.log(error);
            }
        }
    }
}

function saveAuthDataToStorage(token, company, server) 
{
    localStorage.setItem('auth-token', token);
    localStorage.setItem('auth-company', company);
    localStorage.setItem('auth-server', server);
}

function removeAuthDataFromStorage() 
{
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-company');
    localStorage.removeItem('auth-server');
}