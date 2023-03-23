export type SerializedProductImage 
    = string;

export type SerializedProduct = 
    {
        id: string;
        product_key: string,
        price: number,
        cost: number,
        notes: string,
        custom_value1: string,
        custom_value2: SerializedProductImage,
        documents: any[]
    };

export type ProductImages = 
    {
        cover_image: { url: string },
        gallery: Array<{ url: string }>
    };

    

export type Product = 
    Omit<SerializedProduct, 'custom_value1' | 'custom_value2'>
    & { description: string, images: ProductImages };


function serializeProduct(product: Product) : SerializedProduct {
    const temp = {...product};
    delete temp.description;
    delete temp.images;
    return {
        ...temp,
        custom_value1: product.description,
        custom_value2: JSON.stringify(product.images)
    };
}

function deserializeProduct(product: SerializedProduct) : Product {
    const temp = { ...product };
    delete temp.custom_value1;
    delete temp.custom_value2;
    return {
        ...temp,
        description: product.custom_value1,
        images: JSON.parse(product.custom_value2)
    };
}



export type EventHandler = (event : Event) => any;
    
export type HTMLElementEvent<T extends HTMLElement> = Event & {
    target: T; 
    // probably you might want to add the currentTarget as well
    // currentTarget: T;
  }
  





const product : Product = {
    id: '',
    product_key: '',
    price: 0,
    cost: 0,
    notes: '',
    description: '',
    images: null,
    documents: []
};