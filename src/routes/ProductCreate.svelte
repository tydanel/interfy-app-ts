<script>
    import { onDestroy, onMount } from "svelte";
    

    import statusbarStore from "../statusbar-store";
    import createDebugLogger from "../lib/logger";
    

    import ProductForm from "../components/ProductForm.svelte";
    
    const logger = createDebugLogger('ProductCreate');

    onMount(async () => {
        statusbarStore.push({ href:"/products", title: 'Products' })
        statusbarStore.push({ href:"/products/new", title: 'New' })
        // const { get } = await import('../lib/api');
        // Get empty product from server
        // const response = await get('products/create', selectAuthToken(getState()))
        // l/ogger('onMount', ( response ));

        // tempProduct = response.data;
    });

    onDestroy(() => {
        statusbarStore.pop();
        statusbarStore.pop();
    });

    // const handleSubmit = async event => {
    //     event.preventDefault(); 
    //     dispatch(createProduct(event.target));
    // }

    // $: editorHtml = useSelector(
    //     state => state.editor.html,
    //     newVal => editorHtml = newVal
    // )
</script>

<div class="container">
    <div class="d-flex flex-row mt-4 pb-2 mb-4 border-bottom">
        <h3 class="flex-grow-1 m-0 p-0">Products</h3>
        <!-- <a use:link href="/products/new">Create</a> -->
    </div>
    <!-- <pre>{JSON.stringify(tempProduct, 0, 2)}</pre> -->
    <ProductForm />
</div>