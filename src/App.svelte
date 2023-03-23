<script lang="ts">
    import { onMount } from 'svelte';
	import Router from 'svelte-spa-router';
	import routes from './routes';

	import { selectAuth } from './store/selectors';
	import statusbarStore 	from './statusbar-store';
	
	import { useSelector, dispatch, useReadable } from './store/redux'
	import { logout } from './store/slices/auth';

	import LoginForm from './components/LoginForm.svelte';
	import Nav from './components/Nav.svelte';
	
	onMount(() => {
		statusbarStore.push({ 
			title: 'Dashboard', href: '/' 
		});
	});

	$: authState = useReadable(selectAuth);
</script>

<svelte:head>
	<title>Product Manager</title>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
</svelte:head>

<style>
	:global(body, html) {
		margin: 0;
		padding: 0;
	}
#wrapper {
  display: grid;
  width: 100%;
  height: 100vh;
  grid-template:
    [header-left] "head head" 50px [header-right]
    [main-left] "sidebar  main" 1fr [main-right]
    [footer-left] "sidebar  foot" 30px [footer-right]
    / 190px 4fr;
}

#sidebar {
    box-shadow: 1px 1px #efefef; 
	/* border-right: 2px solid #ccc; */
	grid-area: sidebar;
}

#content {
    /* width: 600px; */
    width: 100%;
    height: 100%;
    overflow-x: hidden!important;
	grid-area: main;
}

#header {
	grid-area: head;
	background-color: #222;
	box-shadow: 0px 0px 15px 0px #aaa;
	display: flex;
}
#header a {
	color: white;
}

#statusbar {
	padding: 0;
	margin: 0;
	padding: 0 1em 0 0;
}

#footer {
	grid-area: foot;
    box-shadow: 1px -2px  #efefef;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	justify-items: center;
}
</style>


{#if $authState?.status != 'authenticated'}
	<div class="container d-flex flex-column vh-100 align-items-center justify-content-center">
		<LoginForm />
	</div>
{:else}
	<div id="wrapper">
		<header id="header">
			<p style="color:#ececec;">Welcome {$authState.user.first_name}</p>
			<a class="nav-link" href='#/' on:click={() => dispatch(logout())}>Logout</a>

		</header>
		<aside id="sidebar">
			<Nav />
		</aside>
		<main id="content">
			<Router {routes} />
		</main>
		<footer id="footer">

			<p id="statusbar">
				{#if $statusbarStore && $statusbarStore.length > 0}
					{#each $statusbarStore as item, idx}
						{#if idx == $statusbarStore.length - 1}
							{item.title} 
						{:else}
							<a href="#{item.href}">{item.title}</a> <span>> </span> 
						{/if}
					{/each}
				{/if}
			</p>

		</footer>
	</div>
{/if}


