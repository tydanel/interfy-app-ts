<script>
    import { onDestroy, onMount } from "svelte";
    import { link } from 'svelte-spa-router';

    import statusbarStore from "../statusbar-store";

    import { useSelector, dispatch } from "../store/redux";
    import { refreshProducts } from "../store/slices/products";

    onMount(async () => {        
        statusbarStore.push({ 
			title: 'Products', href: '/products' 
		});
        
        if ( products.length == 0 ) {
            // Try load products if there are none locally
            dispatch(refreshProducts());
        }
    })

    onDestroy(() => {
        statusbarStore.pop();
    })
    
    function refresh() {
        dispatch(refreshProducts());
    }

	$: products = useSelector(
        state => state.products.items
    ,   newVal =>  products = newVal
    );

    $: isLoading = useSelector(
        state => state.products.loading
    ,   newVal => isLoading = newVal
    );

</script>

<div class="container">
    <!-- <div class="card mt-3 mb-4"> -->
        <!-- <div class="card-body "> -->
    <div class="d-flex flex-row mt-4 pb-2 mb-4 border-bottom">
        <h3 class="flex-grow-1 m-0 p-0">Products</h3>
        <a use:link href="/products/new">Create new</a>
        <button on:click={refresh}>Refresh</button>
    </div>
    <!-- </div> -->
    <!-- </div> -->
    {#if !isLoading}
        {#if products.length > 0}
            {#each products as product}
                <div class="card mb-3">
                    <a class="card-body" use:link href={`/products/${product.id}/edit`}>
                        <p>{product.product_key}</p>
                    </a>
                </div>
            {/each}
        {:else}
            <p>No products</p>
        {/if}
    {:else}
        <h1>Loading...</h1>
    {/if}
</div>