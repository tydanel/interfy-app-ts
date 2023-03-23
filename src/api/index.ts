import { dispatch, getState } from '../store/redux';
import { makeProductsApi } from "./products";




const api = {
    get: () => {

    },
    post: () => {

    },
    put: () => {

    }
};






export const products = makeProductsApi({ getState, dispatch, api });
