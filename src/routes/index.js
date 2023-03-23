import Home from './Home.svelte';
import Products from './Products.svelte';
import ProductsCreate from './ProductCreate.svelte';
import ProductsEditor from './ProductEditor.svelte';

import NotFound from './NotFound.svelte';

export default {
    '/': Home,
    '/products': Products,
    '/products/new': ProductsCreate,
    '/products/:id/edit': ProductsEditor,
    // The catch-all route must always be last
    '*': NotFound
};
