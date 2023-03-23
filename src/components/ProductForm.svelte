<script lang="ts">
    import TipTap from "./TipTap.svelte";
    import { useReadable } from "../store/redux";
    
    import { createProduct, updateProduct, updateCurrentProductField, setCurrentProduct, setEmptyCurrentProduct } from '../store/slices/products'
    import { dispatch } from "../store/redux";
    import { onMount } from "svelte";
    
    
    import * as api from '../lib/api';

    import { selectEditorHtml, selectCurrentProduct } from "../store/selectors";

    export let product_id : string = 'new-product';
    export let mode : 'editing' | 'creating' = 'creating';

    function formatHtml(html : string) : string {
        if ( !html ) return;
        var result = '';
        var indent= '';
        html.split(/>\s*</).forEach(function(element) {
        if (element.match( /^\/\w/ )) {
            indent = indent.substring('\t'.length);
        }
        
        result += indent + '<' + element + '>\r\n';
        
        if (element.match( /^<?\w[^>]*[^\/]$/ ) && !element.startsWith("input")  ) { 
            indent += '\t';              
        }
        });
        return result.substring(1, result.length-3);
    }

    const submitHandler  = async event => {
        event.preventDefault();
        if ( mode === 'editing' ) {
            dispatch(updateProduct());
        }
        if ( mode === 'creating') {
            // dispatch(createProduct(event.target as HTMLFormElement));
            dispatch(createProduct());
        }
    };



    const createUpdateDispatcher = (field) => {
        return (event) => {
            console.log(event)
            dispatch(updateCurrentProductField({ 
                field, value: event.target.value
            }));
        }
    };

    onMount(async () => {
        if ( mode == 'creating' ) {
            try {
                const response = await api.get('products/create');
                const product = response.data;
                dispatch(setEmptyCurrentProduct(product));
            } catch (error) {
                console.log(error)
            }
        } else {
            dispatch(setCurrentProduct(product_id))
        }
    });

    $: formState = useReadable(selectCurrentProduct);
    
    $: editorHtml = useReadable(selectEditorHtml);

</script>

{#if mode == 'editing'}
    <div class="mb-3">
        <h4>Gallery</h4>
    </div>
    <div class="mb-3">
        <label for="cover_image">Cover Image</label>
        <br>
        {#if $formState?.images?.cover_image}
            <img style="max-width: 200px;"alt="cover_image"  class="mb-4"
                src={`https://billing.adminsolution.co.za/${$formState?.images?.cover_image}`}
            />
        {/if}

        <input type="file" class="form-control" name="cover_image" id="cover_image" />
    </div>
{/if}

<form on:submit={e => e.preventDefault()}>
    <div class="mb-3">
        <h4>Product meta</h4>
    </div>
    <div class="mb-3">
        <label for="product_key">Product Name</label>
        <input 
            type="text"
            class="form-control"
            name="product_key"
            id="product_key"
            value={$formState?.product_key}
            on:input={createUpdateDispatcher('product_key')}
        >
        <div class="form-text">
            Name of new product (product.product_key)
        </div>
    </div>
    <div class="mb-3">
        <label for="notes">Short Description</label>
        <textarea name="notes" id="notes" class="form-control"
            on:change={createUpdateDispatcher('notes')}
            >{$formState?.notes}</textarea>

        <div class="form-text">
            A short description of the product &lpar;product.notes&rpar;
        </div>
    </div>
    <div class="mb-3">
        <div class="row g-3">
            <div class="col">
                <label for="editor">Full description</label>
                <!-- {#if $editorHtml.length > 0} -->
                <TipTap initial={$formState?.description} dispatcher={data => {
                    dispatch(updateCurrentProductField({ 
                        field: 'description',
                        value: data.html
                    }));
                }}/>
                <!-- {/if} -->
            </div>
            <div class="col">
                <label for="preview">Preview</label>
                <pre>{formatHtml($editorHtml)}</pre>
            </div>
        </div>
    </div>
    <div class="mb-3">
        <h4>Pricing Info</h4>
    </div>
    <div class="row g-3 mb-3">
        <div class="col">
            <label for="price">Sale Price</label>
            <div class="input-group">
                <span class="input-group-text">R</span>
                <input 
                    type="text"
                    class="form-control"
                    name="price"
                    id="price"
                    value={$formState?.price}
                    on:change={createUpdateDispatcher('price')}
                >
            </div>
            <div class="form-text">
                The price you will be selling the product
            </div>
        </div>
        <div class="col">
            <label for="cost">Cost Price</label>

            <div class="input-group">
                <span class="input-group-text">R</span>
                <input 
                    type="text"
                    class="form-control"
                    name="cost"
                    id="cost"
                    value={$formState?.cost}
                    on:change={createUpdateDispatcher('cost')}
                >
            </div>
            <div class="form-text">
                The cost price of the product
            </div>
        </div>
    </div>
    <input type="hidden" name="description" 
        value={$editorHtml}
        on:change={createUpdateDispatcher('description')}>
    <button class="form-control w-100 mb-3" type="submit" on:click={submitHandler}>
        {mode == 'editing' ? 'Save' : 'Create'}
    </button>
</form>
