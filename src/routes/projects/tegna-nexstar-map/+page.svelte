<script>
	import { onMount } from "svelte";

	let { data } = $props();

	let mapContainer;
	let map;
	let tegnaLayer;
	let nexstarLayer;
	let overlapLayer;

	let showTegna = $state(true);
	let showNexstar = $state(true);
	let showOverlap = $state(true);

	function syncLayerVisibility() {
		if (!map) return;

		if (showTegna) map.addLayer(tegnaLayer);
		else map.removeLayer(tegnaLayer);

		if (showNexstar) map.addLayer(nexstarLayer);
		else map.removeLayer(nexstarLayer);

		if (showOverlap) map.addLayer(overlapLayer);
		else map.removeLayer(overlapLayer);
	}

	function toggleLayer(layerName) {
		if (layerName === "tegna") showTegna = !showTegna;
		if (layerName === "nexstar") showNexstar = !showNexstar;
		if (layerName === "overlap") showOverlap = !showOverlap;
		syncLayerVisibility();
	}

	onMount(async () => {
		const L = (await import("leaflet")).default;
		await import("leaflet/dist/leaflet.css");

		map = L.map(mapContainer).setView([39.0, -96.5], 4);
		L.tileLayer(
			"https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
			{
				attribution: "© OpenStreetMap contributors",
			},
		).addTo(map);

		// Load stations data
		tegnaLayer = L.layerGroup();
		nexstarLayer = L.layerGroup();
		overlapLayer = L.layerGroup();

		const tegnaIcon = L.divIcon({
			className: "marker marker-tegna",
			html: '<span aria-hidden="true"></span>',
			iconSize: [18, 18],
			iconAnchor: [9, 9],
		});

		const nexstarIcon = L.divIcon({
			className: "marker marker-nexstar",
			html: '<span aria-hidden="true"></span>',
			iconSize: [18, 18],
			iconAnchor: [9, 9],
		});

		const overlapIcon = L.divIcon({
			className: "marker marker-overlap",
			html: '<span aria-hidden="true"></span>',
			iconSize: [18, 18],
			iconAnchor: [9, 9],
		});

		// Populate the markers
		for (const p of data.tegna) {
			L.marker([p.lat, p.lng], { icon: tegnaIcon })
				.bindPopup(
					`<strong>${p.cityState}</strong><br/><br/>TEGNA: ${p.callSigns}`,
				)
				.addTo(tegnaLayer);
		}
		for (const p of data.nexstar) {
			L.marker([p.lat, p.lng], { icon: nexstarIcon })
				.bindPopup(
					`<strong>${p.cityState}</strong><br/><br/>Nexstar: ${p.callSigns}`,
				)
				.addTo(nexstarLayer);
		}
		for (const p of data.overlap) {
			L.marker([p.lat, p.lng], {icon: overlapIcon})
				.bindPopup(
					`<strong>${p.cityState}</strong><br/><br/>` +
						`TEGNA: ${p.tegnaCallSigns}<br/>` +
						`Nexstar: ${p.nexstarCallSigns}`,
				)
				.addTo(overlapLayer);
		}

		syncLayerVisibility();
	});
</script>

<main class="max-w-4xl mx-auto px-4 py-8">
	<h1 class="text-5xl font-bold">Cities with TEGNA and Nexstar stations</h1>
	<p class="text-lg mt-4">
		Following the March merger of TEGNA and Nexstar, I was curious about the
		scope of the merger, where each company has stations and news markets
		where the companies overlap.
	</p>

	<section class="mt-10">
		<p class="text-gray-500 mb-3">Filter cities by brand presence</p>
		<div id="tegna-nexstar-controls" class="mb-4 flex flex-wrap gap-2">
			<button
				class="toggle-badge tegna"
				class:is-off={!showTegna}
				aria-pressed={showTegna}
				onclick={() => toggleLayer("tegna")}
			>
				TEGNA
			</button>
			<button
				class="toggle-badge nexstar"
				class:is-off={!showNexstar}
				aria-pressed={showNexstar}
				onclick={() => toggleLayer("nexstar")}
			>
				Nexstar
			</button>
			<button
				class="toggle-badge overlap"
				class:is-off={!showOverlap}
				aria-pressed={showOverlap}
				onclick={() => toggleLayer("overlap")}
			>
				Cities with overlap
			</button>
		</div>
		<div
			bind:this={mapContainer}
			class="w-full h-140 rounded-lg overflow-hidden border border-black/10"
			role="img"
			aria-label="Map of TEGNA and Nexstar stations"
		></div>
	</section>

	<section>
		<h2 class="text-2xl font-bold mt-12 space-y-4">Data sources</h2>
		<p>Data comes from <a href="https://www.nexstar.tv/stations/" target="_blank">Nexstar's station map</a> and <a href="https://web.archive.org/web/20260320005639/https://www.tegna.com/brands/" target="_blank">TEGNA's now-defunct map of its brands</a>. Cities are not geocoded according to their exact location, but only to the city they are listed as being located in. Cities were geocoded with data from <a href="https://simplemaps.com/data/us-cities">Simplemaps.com</a>.</p>
	</section>
</main>

<style>
	:global(.marker span) {
		display: block;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 1px solid #f0f0f0;
	}
	:global(.marker-tegna span) {
		background: #c4893a;
	}
	:global(.marker-nexstar span) {
		background: #8fafc2;
	}
	:global(.marker-overlap span) {
		background: #94a265;
	}

	.toggle-badge {
		padding: 0.4rem 0.75rem;
		border-radius: 9999px;
		border: 1px solid #1e1e1e40;
		font-size: 0.85rem;
		line-height: 1;
		transition:
			filter 150ms ease,
			opacity 150ms ease,
			transform 150ms ease;
	}

	.toggle-badge:hover {
		cursor: pointer;
	}

	.toggle-badge.tegna {
		background: #c4893a;
		color: #1e1e1e;
	}

	.toggle-badge.nexstar {
		background: #8fafc2;
		color: #1e1e1e;
	}

	.toggle-badge.overlap {
		background: #94a265;
		color: #1e1e1e;
	}

	.toggle-badge.is-off {
		background: #c2c2c2 !important;
	}
</style>
