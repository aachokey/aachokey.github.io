<script>
	/** @type {{ src: string; alt?: string }[] | string[]} */
	let { images = [], openIndex = $bindable(null) } = $props();

	function toSrc(path) {
		return path.startsWith('http') ? path : `/${String(path).replace(/^\.\.\//, '')}`;
	}
	let normalized = $derived(
		images.map((img) =>
			typeof img === 'string' ? { src: toSrc(img), alt: '' } : { ...img, src: toSrc(img.src) }
		)
	);

	function close() {
		openIndex = null;
	}

	function handleKeydown(e) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if openIndex !== null && normalized[openIndex]}
	<button
		class="lightbox-backdrop"
		onclick={close}
		aria-label="Close lightbox"
	>
		<img
			src={normalized[openIndex].src}
			alt={normalized[openIndex].alt ?? ''}
			class="lightbox-image"
			role="presentation"
		/>
	</button>
{/if}

<style>
	.lightbox-backdrop {
		position: fixed;
		inset: 0;
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.85);
		border: none;
		cursor: default;
	}

	.lightbox-image {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		pointer-events: none;
	}
</style>
