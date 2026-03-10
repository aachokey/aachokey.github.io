<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	let { data } = $props();

	let gridEl;

	onMount(() => {
		const stations = data.stations;
		const cellHeight = 140;
		const margin = { top: 24, right: 8, bottom: 32, left: 44 };

		const cells = gridEl.querySelectorAll('[data-station-index]');

		stations.forEach((station, i) => {
			const el = cells[i];
			if (!el) return;

			const cellWidth = el.clientWidth || gridEl?.clientWidth || 600;
			const innerWidth = cellWidth - margin.left - margin.right;
			const innerHeight = cellHeight - margin.top - margin.bottom;

			const por = station.por;
			const currentYear = station.currentYear || [];
			const yMax = Math.max(
				d3.max(por, (d) => d.max),
				d3.max(currentYear, (d) => d.swe),
				0.1
			);

			const xScale = d3
				.scaleLinear()
				.domain([1, d3.max(por, (d) => d.day)])
				.range([0, innerWidth]);
			const yScale = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]);

			const areaBand = d3
				.area()
				.x((d) => xScale(d.day))
				.y0((d) => yScale(d.p90))
				.y1((d) => yScale(d.p10))
				.curve(d3.curveMonotoneX);

			const lineCurrent = d3
				.line()
				.x((d) => xScale(d.day))
				.y((d) => yScale(d.swe))
				.curve(d3.curveMonotoneX)
				.defined((d) => d.swe != null && !Number.isNaN(d.swe));

			const svg = d3
				.select(el)
				.append('svg')
				.attr('width', cellWidth)
				.attr('height', cellHeight)
				.attr('viewBox', `0 0 ${cellWidth} ${cellHeight}`)
				.attr('class', 'snotel-chart');

			const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

			// Period-of-record band (p10–p90)
			g.append('path')
				.datum(por)
				.attr('fill', 'var(--color-light-blue)')
				.attr('fill-opacity', 0.35)
				.attr('d', areaBand);

			// Current water year line
			if (currentYear.length) {
				g.append('path')
					.datum(currentYear)
					.attr('fill', 'none')
					.attr('stroke', 'var(--color-orange)')
					.attr('stroke-width', 2)
					.attr('stroke-linejoin', 'round')
					.attr('d', lineCurrent);
			}

			// X axis (day of water year) – show a few ticks
			g.append('g')
				.attr('transform', `translate(0,${innerHeight})`)
				.call(
					d3
						.axisBottom(xScale)
						.ticks(5)
						.tickFormat((d) => (d === 1 ? 'Oct' : d === 183 ? 'Apr' : d === 366 ? 'Sep' : ''))
				)
				.selectAll('text')
				.attr('font-size', 9);
			g.selectAll('.domain, .tick line').attr('stroke', 'var(--color-black)').attr('opacity', 0.25);

			// X-axis label
			g.append('text')
				.attr('x', innerWidth / 2)
				.attr('y', innerHeight + 24)
				.attr('text-anchor', 'middle')
				.attr('font-size', 10)
				.attr('fill', 'var(--color-black)')
				.text('Day of water year (Oct 1 = day 1)');

			// Y axis (SWE)
			g.append('g')
				.call(d3.axisLeft(yScale).ticks(3))
				.selectAll('text')
				.attr('font-size', 9);

			// Y-axis label
			g.append('text')
				.attr('transform', `translate(${-24}, ${innerHeight / 2}) rotate(-90)`)
				.attr('text-anchor', 'middle')
				.attr('font-size', 10)
				.attr('fill', 'var(--color-black)')
				.text('SWE (in)');
		});

		return () => {
			gridEl?.querySelectorAll('.snotel-chart').forEach((n) => n.remove());
		};
	});
</script>

<main class="max-w-6xl mx-auto px-4 py-8">
	<h1 class="text-5xl font-bold">Colorado Snowpack</h1>
	<p class="text-lg text-gray-600 mt-4">
		Colorado, like much of the West, has seen a significant decrease in snowpack levels in 2026. Each chart is one
		SNOTEL station: shaded band = historical range (10th–90th percentile by day of water year); orange line = current
		water year SWE.
	</p>

	<div class="mt-8 flex gap-4 items-center flex-wrap">
		<span class="flex items-center gap-2">
			<span class="w-6 h-3 rounded opacity-35" style="background: var(--color-light-blue);"></span>
			<span class="text-sm">Historical range (p10–p90)</span>
		</span>
		<span class="flex items-center gap-2">
			<span class="w-6 h-0.5 border-t-2 border-(--color-orange)"></span>
			<span class="text-sm">Current water year</span>
		</span>
	</div>

	<div
		bind:this={gridEl}
		class="snotel-grid mt-8"
		role="list"
		aria-label="SNOTEL station small multiple charts"
	>
		{#each data.stations as station, i}
			<div
				role="listitem"
				class="snotel-cell"
				data-station-index={i}
				aria-label="{station.station_name} snowpack"
			>
				<div class="snotel-cell-title">{station.station_name}</div>
			</div>
		{/each}
	</div>
</main>

<style>
	.snotel-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.5rem;
	}
	.snotel-cell {
		position: relative;
		min-height: 140px;
		width: 100%;
		background: var(--color-cream);
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 6px;
		overflow: hidden;
	}
	.snotel-cell-title {
		position: absolute;
		top: 4px;
		left: 44px;
		right: 8px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-black);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		pointer-events: none;
	}
	:global(.snotel-chart text) {
		font-family: 'DM Mono', monospace;
		fill: var(--color-black);
	}
</style>
