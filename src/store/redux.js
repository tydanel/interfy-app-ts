import { configureStore } from "@reduxjs/toolkit";
import { readable } from "svelte/store";
import { reducer as productsReducer } from './slices/products';
import { reducer as authReducer, loadAuthDataFromStorage } from './slices/auth';
import { reducer as editorReducer } from './slices/editor';
import { reducer as routeReducer, setupRouter } from './slices/router';
import { reducer as apiReducer } from './slices/api';

import createDebugLogger from "../lib/logger";

const logger = createDebugLogger('store');

const store = configureStore({
    reducer: {
        products: productsReducer,
        auth: authReducer,
        editor: editorReducer,
        router: routeReducer,
        api : apiReducer
    }
});




store.subscribe(function () {
    logger('subscribe', store.getState());
});

export default store;
export const { dispatch, subscribe, getState } = store;



export const useSelector = (select, onChange) => {
    let currentState;
  
    function handleChange() {
      let nextState = select(store.getState());
      if (nextState !== currentState) {
        currentState = nextState;
        onChange(currentState);
      }
    }
  
    store.subscribe(handleChange);
    handleChange();
    return currentState;
  };

store.dispatch(loadAuthDataFromStorage());
setupRouter(store);

export const useReadable = (selector) => {
  let prevValue;
  const initial = selector(getState());
  return readable(initial, function start(set) {

    const unsubscribe = store.subscribe(() => {
      const newValue = selector(getState());
      if ( newValue === prevValue ) return;
      set(newValue);
      prevValue = newValue;

    });
    
    return function stop() {
      unsubscribe();
    }
  })
}
