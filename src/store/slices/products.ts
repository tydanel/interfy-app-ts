
import { createSlice } from "@reduxjs/toolkit";
import { push } from "svelte-spa-router";

const uniqueId = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
  };

import createDebugLogger from "../../lib/logger";
import * as api from '../../lib/api';
import type { SendResult } from "../../lib/api";
import type { Product, SerializedProduct } from '../../types';

import { 
    selectCurrentProduct, 
    selectEditorHtml,
    selectProducts
} from '../selectors';

const logger = createDebugLogger('store:product');

type State =
    {
        items: Product[];
        current: Product|null;
        loading: boolean;
        status: string|null;
        statusTimeout: number|null;
        errorMessage: Error|string|null;
    }

const productsSlice = createSlice({
    name: 'product',
    initialState: {
        items: [] as Array<Product>,
        current: null,
        loading: false,
        status: null,
        statusTimeout: null,
        errorMessage: null
    } as State,
    reducers: {
        addProduct: (state, { payload } : { payload : Product }) => {
            state.items.push(payload);
        },
        addProducts: (state, { payload } : { payload : Array<Product> }) => {
            state.items = [...state.items, ...payload];
        },
        replaceProduct: (state, {payload}) => {
            state.items = state.items.map(item => {
                if (item.id === payload.id) return payload;
                return item;
            })
        },
        setLoading: (state, {payload}) => {
            state.loading = payload;
        },
        setStatus: (state, { payload }) => {
            state.status = payload;
        },
        setStatusTimeout: (state, { payload }) => {
            state.statusTimeout = payload;
        },
        clearStatusTimeout: (state) => {
            state.statusTimeout = null;
        },
        setErrorMessage: (state, { payload }) => {
            state.errorMessage = payload;
        },
        clearErrorMessage: state => {
            state.errorMessage = null
        },
        updateCurrentProductField: (state, { payload }) => {
            state.current[payload.field] = payload.value;
        },
        setCurrentProduct: (state, { payload }) => {
            if ( typeof payload === 'string' )
                state.current = { ...state.items.find(p => p.id === payload) };
            else 
                state.current = payload
        },
        setEmptyCurrentProduct: (state, { payload }) => {
            state.current = payload;
        }
    }
});


export default productsSlice;
export const { reducer, actions } = productsSlice;
export const { 
    addProduct, 
    addProducts, 
    replaceProduct,
    setLoading, 
    setErrorMessage,
    clearErrorMessage,
    setCurrentProduct,
    setEmptyCurrentProduct,
    updateCurrentProductField,
} = actions;

export const productSelector = state => state.products.items


const setStatusAction = actions.setStatus;
const { clearStatusTimeout, setStatusTimeout } = actions;

export function setStatus(status) {
    return (dispatch, getState) => {
        selectProducts
        const timeout = getState().products.statusTimeout;
        if ( timeout ) {
            clearTimeout(timeout);
            dispatch(clearStatusTimeout())
        }
        dispatch(setStatusAction(status));
    }
}

export const refreshProducts = () => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const result = await api.get('products');
        dispatch(setLoading(false));
        dispatch(addProducts(result.data));
    }
}

export const updateProduct = () => {
    return async (dispatch, getState) => {
        const product : Product = selectCurrentProduct(getState());

        const new_product = await api.sendUpdateProductRequest({
             ...product 
        });
        logger('updateProduct', new_product);
        dispatch(setCurrentProduct({ ...new_product }));
        dispatch(replaceProduct({ ...new_product }));
    }
};

export const createProduct = () => {
    return async (dispatch, getState) => {
        const product : Product = selectCurrentProduct(getState());
        logger('createProduct', product);
        
        const new_product = await api.sendCreateProductRequest({
            ...product,
            images: {
                cover_image: null,
                gallery: []
            }
        });
        logger('createProduct', new_product);
        dispatch(addProduct(new_product));
        dispatch(setCurrentProduct(null));
        push('/products/' + new_product.id + '/edit');
    }
}

// Create product normally
// wait for response 

// if there is a cover_image
//      create unique id
//      modify filename to contain id
//      upload the file
//      wait for response
//      set custom_value on product
//      update product with new value
// if there are other images
//      upload normally
