import type { 
    SerializedProductImage,
    ProductImages,
    SerializedProduct,
    Product, 
 } from '../types';
import { getState, dispatch } from '../store/redux';
import { 
    setIsFetching, 
    setDoneFetching, 
    setStatus, 
    setError, 
    setEndpoint, 
    clearRequest,
    clearError
} from '../store/slices/api';

import { selectAuthToken, selectAuthServerAddress } from '../store/selectors';

import createDebugLogger from './logger';
const logger = createDebugLogger('api');

interface SendOpts {
    endpoint: string,
    method: 'GET'|'POST'|'PUT'|'DELETE'|'OPTION',
    body?: any,
    multipart?: boolean,
}

export interface SendResult<T> {
    data?: T;
    meta?: any;
    message: string;
    error?: Error;
    success: boolean;
}

async function send({ 
    multipart = false,
    method = 'GET', 
    endpoint, 
    body , 
} : SendOpts) : Promise<SendResult<any>> {
    const state = getState();
    const token = selectAuthToken(state);
    const server = selectAuthServerAddress(state)
    // Clear the previous request 
    dispatch(clearRequest())
    // Clear any errors 
    dispatch(clearError())


    dispatch(setEndpoint(`${method} ${endpoint}`));
    
    const headers = {};

    if ( !multipart ) {
        headers['Content-Type'] = 'application/json';
    }  // Else let the form data set the content type
    if ( token ) {
        headers['X-API-TOKEN'] = token
    }

    let response;  try {
        dispatch(setIsFetching());
        response = await fetch(`https://${server}/api/v1/${endpoint}`, {
            method: method,
            headers: { ...headers },
            mode: 'cors',
            body: 
                multipart ? body : JSON.stringify(body)
        });
    } catch (error) {
        logger('send:error', error);
        dispatch(setError(error));
        return { success: false, message: error.message, error };
    }
    
    let result; try {
        result = await response.json();
        setDoneFetching();
    } catch ( error ) {
        logger('send:error', error);
        dispatch(setError(error));
        return { success: false, message: 'Error parsing json', error };
    }
    if ( result?.data ) {
        return { success: true, ...result };
    }

    logger('send:error', 'unexpected', result);
    dispatch(setError(new Error(result)));
    return { 
        success: false, 
        message: result.message || "Something went wrong", error: new Error(result) 
    };
    
}

const api = {
    get: async (endpoint) => {
        logger('SENDING', endpoint)
        return await send({ endpoint, method: 'GET' });
    },
    post: async (endpoint, body) => {
        return await send({ endpoint, method: 'POST', body });
    },
    put: async (endpoint, body) => {
        return await send({ endpoint, method: 'PUT', body });
    },
    delete: async (endpoint) => {
        return await send({ endpoint, method: 'DELETE' });
    },
    option: async (endpoint) => {
        return await send({ endpoint, method: 'OPTION' });
    },
    upload: async (endpoint, body) => {
        return await send({ endpoint, body: body, method: 'POST', multipart: true });
    },
    send: send
}

export default api;
export const get    = api.get;
export const post   = api.post;
export const put    = api.put;
export const del    = api.delete;
export const option = api.option;
export const upload = api.upload;
export { send };


function serializeProductImages(images : ProductImages) : SerializedProductImage {
    return JSON.stringify(images) as SerializedProductImage;
}

function deserializeProductImages(string : SerializedProductImage) : ProductImages {
    return JSON.parse(string) as ProductImages;
}
    
// Convert client side product object to what the server wants 
function serializeProduct(p : Product) : SerializedProduct {
    const result = { ...p };
    const images = result.images 
        ? serializeProductImages(result.images)
        : JSON.stringify({
            cover_image: null,
            gallery: []
        });
    const description = result.description;
    
    delete result.images;
    delete result.description;

    return { ...result, 
        [PRODUCT_HTML]: description, 
        [PRODUCT_IMAGES]: images 
    }
}

// Convert server side product object to what the client wants
function deserializeProduct(sp: SerializedProduct) : Product {
    const result = { ...sp };
    const description = sp[PRODUCT_HTML];
    const images = sp[PRODUCT_IMAGES] !== '' 
        ? deserializeProductImages(sp[PRODUCT_IMAGES]) 
        :   ({
                cover_image: null,
                gallery: []        
            });

    delete result[PRODUCT_HTML];
    delete result[PRODUCT_IMAGES];

    return { ...result, images, description };
}

/**
 *  Products API
 */
const PRODUCT_HTML   = 'custom_value1';
const PRODUCT_IMAGES = 'custom_value2';

const uniqueId = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
};

export const sendCreateProductRequest = async (product : Product) : Promise<Product> => {
    const serialized_product = serializeProduct(product);
    const result = (await post('products', serialized_product)) as SendResult<SerializedProduct>;

    if ( !result || !result.data || !result.success ) {
        logger('sendCreateProductRequest:error', result);
        throw new Error(result.message || 'There was an error creating the product');
    }
    return deserializeProduct(result.data);
}

export const sendUpdateProductRequest = async (product : Product) : Promise<Product> => {
    const result = (await put(`products/${product.id}`, serializeProduct(product))) as SendResult<SerializedProduct>;
    if ( !result || !result.data || !result.success ) {
        logger('sendUpdateProductRequest:error', result);
        throw new Error(result.message || "There was an error updating the product");
    }
    return deserializeProduct(result.data);
}

export const sendFindProductRequest = async ({ params } : { params: any }) : Promise<Array<Product>> => {
    const query = Object.keys(params).reduce((str, key, idx, arr) => {
        return `${str}${encodeURIComponent(key)}=${encodeURIComponent(params[key].trim())}${idx < arr.length-1 ? '&' : ''}`;
    }, '')
    const result = await get('products?'+query) as SendResult<Array<SerializedProduct>>;
    if ( !result || !result.data || !result.success ) {
        logger('sendFindProductRequest:error', result);
        throw new Error(result.message || "There was an error requesting products from the server");
    }
    return result.data.map(product => deserializeProduct(product));
}

export const sendDeleteProductRequest = async (product : Product | string) : Promise<Product> => {
    const product_id = typeof(product) === 'string' ? product : product.id;
    const result = await del(`products/${product_id}`) as SendResult<SerializedProduct>;
    if ( !result || !result.data || !result.success ) {
        logger('sendDeleteProductRequest:error', result);
        throw new Error(result.message || 'There was an error deleting the product from the server');
    }
    return deserializeProduct(result.data);
}

const sendUpdateCoverImageCustomValueRequest = async ({ name, product }) : Promise<Product> => {
    const current_value : ProductImages = deserializeProductImages(product[PRODUCT_IMAGES]);
    current_value.cover_image = name;
    const new_product = { ...product, images: serializeProductImages(current_value) };
    return await sendUpdateProductRequest(new_product);
};

export const sendUploadProductCoverImageRequest = async (product : Product | string, cover_image : File) : Promise<Product> => {
    const product_id = typeof(product) === 'string' ? product : product.id;
    const form_data = new FormData();
    const cover_image_name = uniqueId() + '-' + cover_image.name;

    form_data.append('_method', 'put');
    form_data.append('documents[]', cover_image, cover_image_name);

    dispatch(setStatus(`uploading image ${cover_image_name}`));
    const upload_result = await upload(`products/${product_id}`, form_data) as SendResult<SerializedProduct>;
    if ( !upload_result || !upload_result.data || !upload_result.success ) {
        logger('sendUploadProductCoverImageRequest:error', upload_result);
        throw new Error(upload_result.message || "There was and error uploading the cover image");
    }

    dispatch(setStatus('updating image data'));
    const update_result = await sendUpdateCoverImageCustomValueRequest({
        name: cover_image_name,
        product: upload_result.data,
    });
    
    if ( !update_result ) {
        logger('sendUploadProductCoverImageRequest:error', 'No update result');
        throw new Error("No update result");
    }

    dispatch(setStatus('image upload successfull'));
    
    return update_result;
}

export const sendGetProductRequest = async (product : Product | string) : Promise<Product> => {
    const product_id = typeof(product) === 'string' ? product : product.id;
    dispatch(setStatus(`fetching product ${product_id}`));

    const result = await api.get(`products/${product_id}`) as SendResult<SerializedProduct>;
    if ( !result || !result.data || !result.success ) {
        logger('sendGetProductRequest:error', result);
        throw new Error(`Could not fetch product ${product_id}`);
    }

    return deserializeProduct(result.data);
}