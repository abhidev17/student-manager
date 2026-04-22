<script>
	import favicon from '$lib/assets/favicon.svg';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/stores';

	let { children } = $props();

	const authRoutes = ['/login', '/signup', '/forgot'];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if authRoutes.includes($page.url.pathname)}
	{@render children()}
{:else}
	<div class="app-container">
		<aside class="sidebar" in:fly={{ x: -10, duration: 200 }}>
			<div class="logo">
				<div class="logo-icon">S</div>
				<span>Gradely</span>
			</div>
			<nav>
				<a href="/dashboard" class:active={$page.url.pathname === '/dashboard'}>
					Dashboard
				</a>
				<a href="/" class:active={$page.url.pathname === '/'}>
					Students
				</a>
			</nav>
		</aside>

		<main class="main-content">
			<header class="top-nav">
				<h1>{$page.url.pathname.split('/').pop()?.toUpperCase() || 'HOME'}</h1>
				<div class="user-profile">
					<div class="avatar">A</div>
				</div>
			</header>

			<section class="page-body" in:fade={{ duration: 200 }}>
				{@render children()}
			</section>
		</main>
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
		font-family: 'Inter', sans-serif;
		background-color: #f8fafc;
		color: #1e293b;
	}

	.app-container {
		display: flex;
		min-height: 100vh;
	}

	.sidebar {
		width: 260px;
		background: #ffffff;
		border-right: 1px solid #e2e8f0;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 12px;
		font-weight: 700;
		font-size: 1.25rem;
		color: #0f172a;
	}

	.logo-icon {
		width: 32px;
		height: 32px;
		background: #3b82f6;
		color: white;
		border-radius: 8px;
		display: grid;
		place-items: center;
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	nav a {
		text-decoration: none;
		color: #64748b;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		transition: all 0.2s;
		font-weight: 500;
	}

	nav a:hover,
	.active {
		background: #eff6ff;
		color: #3b82f6;
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.top-nav {
		height: 64px;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid #e2e8f0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 2rem;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.avatar {
		width: 32px;
		height: 32px;
		border-radius: 999px;
		background: #3b82f6;
		color: #fff;
		display: grid;
		place-items: center;
		font-weight: 700;
	}

	.page-body {
		padding: 2rem;
		max-width: 1200px;
		width: 100%;
		margin: 0 auto;
	}

	@media (max-width: 768px) {
		.sidebar {
			display: none;
		}
	}
</style>
