<script lang="ts">
    import type { Product } from "../types";

    import { onDestroy, onMount } from "svelte";
    import { link } from "svelte-spa-router";
    import statusbarStore from "../statusbar-store";
    
    import ProductForm from "../components/ProductForm.svelte";

    onMount(async () => {
        statusbarStore.push({ href:"/products", title: 'Products' })
        statusbarStore.push({ href:`/products/${params.id}/edit`, 
        title: `${params.id}|edit` })
    });
    onDestroy(() => {
        statusbarStore.pop();
        statusbarStore.pop();
    });
    
    export let params;

    const refresh = () => {

    };

</script>

<div class="container">
    <div class="d-flex flex-row mt-4 pb-2 mb-4 border-bottom">
        <h3 class="flex-grow-1 m-0 p-0">Editing ({params.id})</h3>
        <a use:link href="/products/new">Create</a>
        <button on:click={refresh}>Refresh</button>
    </div>
    <ProductForm product_id={params.id} mode="editing"/>
</div>