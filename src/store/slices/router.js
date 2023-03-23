import { createSlice } from "@reduxjs/toolkit";
// import { 
//     replace as srReplace,
//     push as srPush, 
//     pop as srPop
// } from 'svelte-spa-router';

const routerSlice = createSlice({
    name: 'router',
    initialState: {
        loc: null,
        params: null
    },
    reducers: {
        locationChanged(state, { payload }) {
            state.loc = payload;
        },
        paramsChanged(state, { payload }) {
            state.params = payload;
        }
    }
});


export const { reducer, actions } = routerSlice;


export const selectQuerystring  = state => state.router.loc.querystring;
export const selectLocation     = state => state.router.loc.location;
export const selectParams       = state => state.router.params;
export const selectLoc          = state => state.router.loc;


export function setupRouter(store) {
    function getLocation() {
        const hashPosition = window.location.href.indexOf('#/')
        let location = (hashPosition > -1) ? window.location.href.substr(hashPosition + 1) : '/'
        // Check if there's a querystring
        const qsPosition = location.indexOf('?')
        let querystring = ''
        if (qsPosition > -1) {
            querystring = location.substr(qsPosition + 1)
            location = location.substr(0, qsPosition)
        }
        return {location, querystring, href: window.location.href};
    }
    
    window.addEventListener('hashchange', () => {
        store.dispatch(actions.locationChanged(getLocation()));
    }, false);
}

export function readableLoc(store) {
    let lastHref;
    return {
        subscribe: handler => {
            store.subscribe(() => {
                const loc = selectLoc(store.getState());
                if ( loc.href === lastHref )
                {
                    return;
                }
                lastHref = loc.href;
                handler(loc);
                return loc;
            })
        }
    }
}

export function writeableParams(store) {
    return {
        set: params => {
            store.dispatch(actions.paramsChanged(params));
        },
        subscribe: handler => {
            store.subscribe(() => {
                const params = selectParams(store.getState());
                handler(params);
                return params;
            });
        }
    }
}