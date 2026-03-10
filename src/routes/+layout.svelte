<script>
	import '../app.css';
	import { page } from '$app/stores';
	let { children } = $props();

	const navLinks = [
		{ href: '/', label: 'home' },
		{ href: '/about', label: 'about' },
		{ href: '/work', label: 'work' },
	];
</script>

<header class="nav-bar">
	<nav class="nav-inner" aria-label="Main navigation">
		<a href="/" class="nav-brand">Aric Chokey</a>
		<ul class="nav-links">
			{#each navLinks as link}
				<li>
					<a
						href={link.href}
						class="nav-link"
						class:active={$page.url.pathname === link.href || (link.href !== '/' && $page.url.pathname.startsWith(link.href))}
					>
						{link.label}/
					</a>
				</li>
			{/each}
		</ul>
	</nav>
	<hr>
</header>

<main class="mt-14">
	{@render children()}
</main>

<footer class="max-w-6xl mx-auto px-4 py-8">
	<div class="flex-col">

		<hr>
		<div class="mt-5 justify-items-center sm:justify-items-center lg:flex lg:justify-between">

			<div class="flex">
				<div class="flex gap-3">
					<p class="text-gray-400"><a href="https://bsky.app/profile/aricchokey.bsky.social" target="_blank">Bluesky</a></p>
					<p class="text-gray-400"><a href="https://github.com/aachokey" target="_blank">GitHub</a></p>
					<p class="text-gray-400"><a href="https://www.linkedin.com/in/aricchokey/" target="_blank">LinkedIn</a></p>
				</div>
			</div>
			<div class="flex mt-5 md:mt-5 lg:mt-0">
				<p class="text-gray-400">© 2026 Aric Chokey</p>
			</div>


		</div>
	</div>
</footer>

<style>
	.nav-bar {
		/* background-color: var(--color-dark-green); */
		color: var(--color-black);
		/* border-bottom: 2px solid var(--color-forest-green); */
	}
	.nav-inner {
		/* max-width: 72rem; */
		margin: 0 auto;
		padding: 1rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
	}
	.nav-brand {
		font-family: 'Playfair Display', Georgia, serif;
		font-weight: 700;
		font-size: 1.25rem;
		color: var(--color-black);
		text-decoration: none;
	}
	.nav-brand:hover {
		/* text-decoration: underline; */
		color: var(--color-orange);
	}
	.nav-links {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 1.5rem;
	}
	.nav-link {
		color: var(--color-light-blue);
		text-decoration: none;
		font-size: 0.95rem;
		opacity: 0.9;
	}
	.nav-link:hover,
	.nav-link.active {
		opacity: 1;
		border-bottom: 2px solid var(--color-orange);
		color: var(--color-orange);
	}

	hr {
		color: #d1d1d1;
		margin: 1rem auto;
		border-radius: 1px;
		opacity: 0.7;
		max-width: 95%;
	}

	footer a {
		color: var(--color-gray-400);
		text-decoration: none;
		border-bottom: 1px solid var(--color-orange)
	}
</style>
