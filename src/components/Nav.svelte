<script>
    // import tokenStore from "../token-store";
    import { link } from 'svelte-spa-router';
    import active from 'svelte-spa-router/active';
    import { dispatch } from '../store/redux';
    import { logout } from '../store/slices/auth'


</script>

<nav class="nav flex-column mt-2">
    <a 
        use:link 
        use:active
        class="nav-link"
        href="/">Dashboard</a>
    <a 
        use:link 
        use:active={{ path: '/products*', className: 'active' }} 
        class="nav-link" href="/products">Products</a>
    <a 
        use:link 
        use:active
        class="nav-link"
        href="/settings">Settings</a>

    <a class="nav-link" href='#/' on:click={() => dispatch(logout())}>Logout</a>
</nav>