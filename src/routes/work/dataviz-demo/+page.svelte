<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	let { data } = $props();

	let mapContainer;
	let barContainer;
	let lineContainer;
	let map;
	let barSvg;
	let lineSvg;

	onMount(async () => {
		// ---- Map (Leaflet) ----
		// Dynamic import so Leaflet (which uses `window`) only runs in the browser
		const L = (await import('leaflet')).default;
		await import('leaflet/dist/leaflet.css');

		map = L.map(mapContainer).setView([39.0, -105.5], 7);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors'
		}).addTo(map);

		// Custom marker so default icon path works in Vite
		const markerIcon = L.divIcon({
			className: 'dataviz-marker',
			html: '<span aria-hidden="true"></span>',
			iconSize: [20, 20],
			iconAnchor: [10, 10]
		});

		for (const point of data.mapMarkers) {
			L.marker([point.lat, point.lng], { icon: markerIcon })
				.bindTooltip(`${point.city}: ${point.value}`, { permanent: false, direction: 'top' })
				.addTo(map);
		}

		// ---- D3 Bar chart ----
		const barWidth = barContainer.clientWidth;
		const barHeight = 280;
		const margin = { top: 20, right: 20, bottom: 40, left: 44 };
		const innerWidth = barWidth - margin.left - margin.right;
		const innerHeight = barHeight - margin.top - margin.bottom;

		const xScale = d3
			.scaleBand()
			.domain(data.barData.map((d) => d.label))
			.range([0, innerWidth])
			.padding(0.2);
		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(data.barData, (d) => d.value)])
			.range([innerHeight, 0])
			.nice();

		barSvg = d3
			.select(barContainer)
			.append('svg')
			.attr('width', barWidth)
			.attr('height', barHeight)
			.attr('viewBox', `0 0 ${barWidth} ${barHeight}`)
			.attr('class', 'bar-chart-svg');

		const barG = barSvg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

		barG
			.selectAll('rect')
			.data(data.barData)
			.join('rect')
			.attr('x', (d) => xScale(d.label))
			.attr('y', (d) => yScale(d.value))
			.attr('width', xScale.bandwidth())
			.attr('height', (d) => innerHeight - yScale(d.value))
			.attr('fill', 'var(--color-light-blue)')
			.attr('rx', 4);

		barG
			.append('g')
			.attr('transform', `translate(0,${innerHeight})`)
			.call(d3.axisBottom(xScale))
			.selectAll('text')
			.attr('class', 'bar-axis-text');
		barG.append('g').call(d3.axisLeft(yScale).ticks(6));

		// ---- D3 Line chart ----
		const lineWidth = lineContainer.clientWidth;
		const lineHeight = 280;
		const lineMargin = { top: 20, right: 20, bottom: 40, left: 44 };
		const lineInnerWidth = lineWidth - lineMargin.left - lineMargin.right;
		const lineInnerHeight = lineHeight - lineMargin.top - lineMargin.bottom;

		const lineXScale = d3
			.scaleLinear()
			.domain(d3.extent(data.lineData, (d) => d.month))
			.range([0, lineInnerWidth]);
		const lineYScale = d3
			.scaleLinear()
			.domain(d3.extent(data.lineData, (d) => d.value))
			.range([lineInnerHeight, 0])
			.nice();

		const lineGenerator = d3
			.line()
			.x((d) => lineXScale(d.month))
			.y((d) => lineYScale(d.value))
			.curve(d3.curveMonotoneX);

		lineSvg = d3
			.select(lineContainer)
			.append('svg')
			.attr('width', lineWidth)
			.attr('height', lineHeight)
			.attr('viewBox', `0 0 ${lineWidth} ${lineHeight}`)
			.attr('class', 'line-chart-svg');

		const lineG = lineSvg.append('g').attr('transform', `translate(${lineMargin.left},${lineMargin.top})`);

		lineG
			.append('path')
			.datum(data.lineData)
			.attr('fill', 'none')
			.attr('stroke', 'var(--color-dark-green)')
			.attr('stroke-width', 2)
			.attr('stroke-linejoin', 'round')
			.attr('d', lineGenerator);

		lineG
			.selectAll('circle')
			.data(data.lineData)
			.join('circle')
			.attr('cx', (d) => lineXScale(d.month))
			.attr('cy', (d) => lineYScale(d.value))
			.attr('r', 4)
			.attr('fill', 'var(--color-orange)');

		lineG
			.append('g')
			.attr('transform', `translate(0,${lineInnerHeight})`)
			.call(
				d3
					.axisBottom(lineXScale)
					.ticks(12)
					.tickFormat((m) => ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][m - 1])
			);
		lineG.append('g').call(d3.axisLeft(lineYScale).ticks(6));

		return () => {
			if (map) map.remove();
			d3.select(barContainer).selectAll('svg').remove();
			d3.select(lineContainer).selectAll('svg').remove();
		};
	});
</script>

<main class="max-w-4xl mx-auto px-4 py-8">
	<h1 class="text-5xl font-bold">Dataviz Demo</h1>
	<p class="text-lg mt-4">
		Example project: a Leaflet map and two D3 charts (bar and line). Data is loaded in
		<code class="bg-black/5 px-1 rounded">+page.js</code>.
	</p>

	<section class="mt-10">
		<h2 class="text-2xl mb-4">Map (Leaflet)</h2>
		<div
			bind:this={mapContainer}
			class="w-full h-80 rounded-lg overflow-hidden border border-black/10"
			role="img"
			aria-label="Map of sample points in Colorado"
		></div>
	</section>

	<section class="mt-10">
		<h2 class="text-2xl mb-4">Bar chart (D3)</h2>
		<p class="text-sm opacity-80 mb-2">Monthly values (sample)</p>
		<div bind:this={barContainer} class="w-full bar-chart-container"></div>
	</section>

	<section class="mt-10">
		<h2 class="text-2xl mb-4">Line chart (D3)</h2>
		<p class="text-sm opacity-80 mb-2">Time series (sample)</p>
		<div bind:this={lineContainer} class="w-full line-chart-container"></div>
	</section>
</main>

<style>
	/* Leaflet injects .dataviz-marker; style it globally */
	:global(.dataviz-marker span) {
		display: block;
		width: 20px;
		height: 20px;
		background: var(--color-orange);
		border: 2px solid var(--color-dark-green);
		border-radius: 50%;
	}
	:global(.bar-chart-svg text),
	:global(.line-chart-svg text) {
		font-family: 'DM Mono', monospace;
		font-size: 12px;
		fill: var(--color-black);
	}
	:global(.bar-chart-svg .domain),
	:global(.bar-chart-svg .tick line),
	:global(.line-chart-svg .domain),
	:global(.line-chart-svg .tick line) {
		stroke: var(--color-black);
		opacity: 0.3;
	}
</style>
