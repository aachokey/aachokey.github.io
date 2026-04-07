<script type="module">
    import * as d3 from 'd3'
    import { onMount } from 'svelte';
    import 'leaflet/dist/leaflet.css';
    import '$lib/styles/d3-theme.css';

    let chartContainer
    let mapContainer
    let map
    const markers = new Map()
    let currentStationData = null
    let currentStationName = null
    let currentStationMeta = null
    let currentStationColor = null
    let selectedStation = '602'
    let stations = []
    let initialLoad = true

    const currentYear = '2026'
    const currentYearLabel = '2025–2026'
    const markerColor = d3.scaleSequential(d3.interpolateYlOrRd).domain([1, 0])

    const incompleteStations = [
        "827",
        "1058",
        "1188",
        "1185",
        "1186",
        "1187",
        "793",
        "1251",
        "1252",
        "1324",
        "1325",
        "1326",
        "1344"
    ]


    // Load the actual data files
    async function loadStationData(stationId) {
        const res = await fetch(`colorado-snowpack/data/${stationId}.json`);

        return await res.json()
    }



    // Renders the chart, based on the station data file
    function render(container, data, stationName, containerWidth) {

        d3.select(container).selectAll("svg").remove()
        const innerWidth = Math.max(containerWidth, 200)
        const height = 400

        const margin = { top: 28, right: 12, bottom: 28, left: 40 };

        const x = d3.scaleLinear()
            .domain([1, 270])
            .range([margin.left, innerWidth - margin.right]);

        // We dont want the entire year, so filter down the input data.
        const domainData = data.filter(d => d.wateryear_day <= 270)


        const yMax = d3.max(domainData, d => {
            const sweVal = d[currentYear]
            return Math.max(d.Max, sweVal !== null ? sweVal : 0)
        });


        const y = d3.scaleLinear()
            .domain([0, yMax])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const svg = d3.select(container)
            .append("svg")
            .attr("width", innerWidth)
            .attr("height", height);

        // Format the year months so we can put it into the x axis
        const waterYearMonth = (day) => {
            const date = new Date(2024, 9, 1);
            date.setDate(date.getDate() + (day - 1));
            return d3.timeFormat("%b")(date);
        };

        // Make the x and y axis
        const xAxis = d3.axisBottom(x)
            .tickValues([1, 32, 62, 93, 124, 152, 183, 213, 244, 274])
            .tickFormat(waterYearMonth);

        const yAxis = d3.axisLeft(y).ticks(5);

        const yGrid = d3.axisLeft(y)
            .ticks(5)
            .tickSize(-(innerWidth - margin.left - margin.right))
            .tickFormat("");

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yGrid);

        // Max-min value shaded band
        const area = d3.area()
            .x(d => x(d.wateryear_day))
            .y0(d => y(d.Max))
            .y1(d => y(d.Min));

        svg.append("path")
            .datum(domainData)
            .attr("class", "series-area")
            .attr("d", area);

        // Add the 1991-2020 median line
        const medianLine = d3.line()
            .x(d => x(d.wateryear_day))
            .y(d => y(d["Median ('91-'20)"]));

        svg.append("path")
            .datum(domainData)
            .attr("class", "series-line stroke-7")
            .style("stroke-dasharray", "4,3")
            .style("stroke-width", 1.5)
            .attr("d", medianLine);

        // Plot the median peak vertical line
        const peakRow = data.find(d => d["Median Peak SWE"] !== null)
        if (peakRow) {
            svg.append("line")
                .attr("x1", x(peakRow.wateryear_day))
                .attr("x2", x(peakRow.wateryear_day))
                .attr("y1", margin.top)
                .attr("y2", height - margin.bottom)
                .attr("stroke", "#999")
                .attr("stroke-width", 1)
                .style("stroke-dasharray", "2,3")

            svg.append("text")
                .attr("x", x(peakRow.wateryear_day) + 5)
                .attr("y", margin.top + 40)
                .attr("font-size", "14px")
                .attr("fill", "#999")
                .text("Median peak")
        }

        // Add the current year line
        const currentYearData = data.filter(d => d[currentYear] !== null)
        const line = d3.line()
            .x(d => x(d.wateryear_day))
            .y(d => y(d[currentYear]));

        svg.append("path")
            .datum(currentYearData)
            .attr("class", "series-line")
            .style("stroke", currentStationColor)
            .attr("d", line);

        svg.append("g")
            .attr("class", "axis axis-x")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis axis-y")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(margin.top + (height - margin.top - margin.bottom) / 2))
            .attr("y", -30)
            .attr("fill", "#666")
            .attr("font-size", "12px")
            .attr("text-anchor", "middle")
            .text("Snow-water equivalent (in)");


        // Make the vertical line for the tooltip
        const tooltipLine = svg.append("line")
            .attr("y1", margin.top)
            .attr("y2", height - margin.bottom)
            .attr("stroke", "#6e6e6e")
            .style("stroke-dasharray", "5,3")
            .attr("opacity", 0)

        // ForeignObject is amazing for tooltips!
        const tooltip = svg.append("foreignObject")
            .attr("width", 250)
            .attr("height", 110)
            .attr("opacity", 0)

        const tooltipDiv = tooltip.append("xhtml:div")
            .style("font-size", "12px")
            .style("font-family", "inherit")
            .style("background", "white")
            .style("border", "1px solid #ddd")
            .style("border-radius", "4px")
            .style("padding", "6px 10px")
            .style("box-shadow", "0 1px 4px rgba(0,0,0,0.1)")
            .style("line-height", "1.5")
            .style("width", "fit-content")
            .attr("class", "tooltip-box")

        // Circles at data intersections
        const circleCurrent = svg.append("circle").attr("r", 5).attr("fill", currentStationColor).attr("stroke", "#e0e0e0").attr("opacity", 0)
        const circleMax = svg.append("circle").attr("r", 5).attr("fill", "#8fafc2").attr("stroke", "#fff").attr("opacity", 0)
        const circleMin = svg.append("circle").attr("r", 5).attr("fill", "#2e3d4f").attr("stroke", "#fff").attr("opacity", 0)

        // Invisible rect to capture mouse events!
        svg.append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", innerWidth - margin.left - margin.right)
            .attr("height", height - margin.top - margin.bottom)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("mousemove", onMouseMove)
            .on("mouseleave", onMouseLeave)

        function onMouseMove(event) {
            const [mouseX] = d3.pointer(event, this)
            const day = Math.round(x.invert(mouseX))
            const clampedDay = Math.max(1, Math.min(366, day))
            const row = data[clampedDay - 1]

            tooltipLine
                .attr("x1", x(clampedDay))
                .attr("x2", x(clampedDay))
                .attr("opacity", 1)

            circleMax.attr("cx", x(clampedDay)).attr("cy", y(row.Max)).attr("opacity", 1)
            circleMin.attr("cx", x(clampedDay)).attr("cy", y(row.Min)).attr("opacity", 1)

            const sweVal = row[currentYear]
            if (sweVal !== null) {
                circleCurrent.attr("cx", x(clampedDay)).attr("cy", y(sweVal)).attr("opacity", 1)
            } else {
                circleCurrent.attr("opacity", 0)
            }

            tooltip
                .attr("x", x(clampedDay) + 10)
                .attr("y", margin.top)
                .attr("opacity", 1)

            tooltipDiv.html(`
                <div style="font-weight:bold">${row.humanized_date}</div>
                <div><span class="tooltip-text" style="background-color:${currentStationColor};font-weight:bold">${currentYearLabel}:</span> ${sweVal !== null ? sweVal + ' in' : 'N/A'}</div>
                <div><span class="tooltip-text" style="background-color:#8fafc2;font-weight:bold">Record high:</span> ${row.Max} in (${row.max_year ?? '—'})</div>
                <div><span class="tooltip-text" style="background-color:#2e3d4f;font-weight:bold">Record low:</span> ${row.Min} in (${row.min_year ?? '—'})</div>
            `)
        }

        function onMouseLeave() {
            tooltipLine.attr("opacity", 0)
            tooltip.attr("opacity", 0)
            circleCurrent.attr("opacity", 0)
            circleMax.attr("opacity", 0)
            circleMin.attr("opacity", 0)
        }
    }


    function loadText() {
        const meltoutText = "";
        console.log(currentStationMeta.current_meltout_date)
        if (currentStationMeta.current_meltout_date !== null) {
            console.log("Meltout detected!")

        }
    }

    // Wraps the data file load and chart rendering functions
    async function loadAndRender(stationId) {
        currentStationData = await loadStationData(stationId)

        currentStationMeta = stations.find(s => s.station_id === stationId)
        currentStationName = currentStationMeta ? currentStationMeta.name : stationId
        const pct = currentStationMeta?.latest_data_percent_median
        currentStationColor = pct != null ? markerColor(pct) : '#999'

        markers.forEach(m => m.closeTooltip())

        if (map && currentStationMeta) {
            map.once('moveend', () => {
                const activeMarker = markers.get(stationId)
                if (activeMarker) activeMarker.openTooltip()
            })

            if (initialLoad) {
                const activeMarker = markers.get(stationId)
                if (activeMarker) activeMarker.openTooltip()
                initialLoad = false
            } else {
                map.flyTo([currentStationMeta.latitude, currentStationMeta.longitude], 8)
            }
        }

        render(chartContainer, currentStationData, currentStationName, chartContainer.clientWidth)
        loadText()
    }



    onMount(async () => {

        // Load the stations list
        const stationsRes = await fetch('/projects/colorado-snowpack/data/station_summaries.json')
        stations = await stationsRes.json()
        stations = stations.filter(d => d.latest_data_percent_median != null)

        const L = (await import('leaflet')).default

        map = L.map(mapContainer).setView([39.2, -105.8], 6)

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
            maxZoom: 12
        }).addTo(map)

        stations.forEach(station => {
            if (!station.latitude || !station.longitude) return

            const pct = station.latest_data_percent_median

            const fill = pct != 0 ? markerColor(pct) : '#999'

            const marker = L.circleMarker([station.latitude, station.longitude], {
                radius: 6,
                fillColor: fill,
                color: '#fff',
                weight: 1.5,
                fillOpacity: 0.9
            })
                .bindTooltip(station.name, { permanent: false })
                .on('click', () => {
                    selectedStation = station.station_id
                    loadAndRender(station.station_id)
                })
                .addTo(map)

            markers.set(station.station_id, marker)
        })

        // Hacky map legend ticks
        
        const legendMargins = { top: 20, right: 20, bottom: 30, left: 10 };
        const legendWidth = 200
        const legendHeight = 10
        const legendSvg = d3.select("#map-legend-bar-container")
            .append("svg")
            .attr("width", legendWidth + legendMargins.left + legendMargins.right)
            .attr("height", 30)

        const gradient = legendSvg.append("defs")
            .append("linearGradient")
            .attr("id", "legend-gradient")
            .attr("x1", "0%")
            .attr("x2", "100%")
            
        const stops = [0, 0.25, 0.5, 0.75, 1.0]
        gradient.selectAll("stop")
            .data(stops)
            .enter()
            .append("stop")
            .attr("offset", d => (d * 100) + "%")
            .attr("stop-color", d => markerColor(d))

        legendSvg.append("rect")
            .attr("x", legendMargins.left)
            .attr("y", 0)
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .attr("rx", 2)
            .style("fill", "url(#legend-gradient)")
            
        const legendScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, legendWidth])
        const legendAxis = d3.axisBottom(legendScale)
            .tickValues([0, 25, 50, 100])
            .tickFormat(d => d + "%")
            .tickSize(4)
        legendSvg.append("g")
            .attr("transform", `translate(0, ${legendHeight})`)
            .call(legendAxis)
            .attr("transform", `translate(${legendMargins.left}, ${legendHeight})`)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick text").attr("font-size", "12px").attr("color", "#555"))


        // Load initial station data
        await loadAndRender(selectedStation)

        // Render with screen size observer so it's responsive
        const resizeObserver = new ResizeObserver((entries) => {
            if (currentStationData) {
                render(chartContainer, currentStationData, currentStationName, entries[0].contentRect.width)
            }
        });

        resizeObserver.observe(chartContainer)

        return () => {
            resizeObserver.disconnect()
            map.remove()
        }

    });


</script>

<svelte:head>
    <title>Snowpack in Colorado | Aric Chokey</title>
    <meta name="description"
        content="An interactive look at snowpack levels in Colorado and the Rocky Mountains. Data comes from snow water equivelent measurements from the USDA's SNOTEL sensor network." />
</svelte:head>

<main class="max-w-4xl mx-auto px-4 py-8">
<div class="container">

    <h1 class="text-5xl font-bold">Colorado Snowpack</h1>
    <p class=" text-gray-500 mt-4">Published April 6, 2026, Updated daily</p>
    <div id="story-container">
        <p class="text-lg mt-4">As Colorado experiences one its lowest years for snowpack, data shows some areas throughout the state are
            seeing record snowmelt much earlier compared to historical averages.</p>
        <p class="text-lg mt-4">The data comes from the U.S. Department of Agriculture's snow telemetry monitoring network, also known as
            SNOTEL. Stations are dispersed across the state and measure snowpack according to snow-water equivalent, or
            the amount of water available in the snow, according to the USDA. SWE is measured in inches.</p>
        <p class="text-lg mt-4">The map below shows the location of each station and its current snowpack level as a percentage of the median for the day historically.</p>

        <div class="graphic-group">


            <div id="map-legend">
                <div id="map-legend-bar-container">
                    <p class="map-legend-caption">Percent SWE Median</p>
                </div>
                <span class="legend-item"><span class="legend-circle" style="background:#999"></span> No current snowpack</span>
            </div>
            <div id="station-map" bind:this={mapContainer}></div>

            <div class="dynamic-text">

                <p>The <select class="select" bind:value={selectedStation} on:change={()=> loadAndRender(selectedStation)}>
                        {#each stations as station}
                        <option value={station.station_id}>{station.name}</option>
                        {/each}

                    </select> station measured SWE at <span class="bg-current"
                        style:background-color={currentStationColor}>{currentStationMeta?.latest_data_value}
                        inches</span>
                    as of
                    {currentStationMeta?.latest_data_date}.
                    {#if currentStationMeta?.latest_data_percent_median}
                    That's <span class="bg-span"
                        style:background-color={currentStationColor}>{(currentStationMeta.latest_data_percent_median *
                        100).toFixed(1)}%</span>
                    of the median for the day historically.
                    {/if}




                    {#if currentStationMeta?.current_meltout_date}
                    This year, the area saw a total snowmelt on {currentStationMeta.current_meltout_date}, which is
                    <span class="bg-gray">{currentStationMeta.historic_meltout_day -
                        currentStationMeta.current_meltout_day}
                        days</span> earlier than the earliest total meltout recorded so far.
                    {/if}
                </p>
            </div>

        </div>
        <div id="chart-legend">
            <span class="legend-item"><span class="legend-swatch" style="background:#e0e0e0"></span> Historical
                range</span>
            <span class="legend-item"><span class="legend-line-dotted" style="border-color:#a5a5a5"></span> Median
                (1991–2020)</span>
            <span class="legend-item"><span class="legend-line" style:border-color={currentStationColor}></span>
                {currentYearLabel}</span>
        </div>
        <div class="d3-theme" bind:this={chartContainer} id="snowpack-chart-container">
        </div>

        <h2 class="text-2xl font-bold mt-12 space-y-4">About this data</h2>
        <p class="text-lg mt-4">Data is updated daily from the USDA's SNOTEL station feeds <a href="https://nwcc-apps.sc.egov.usda.gov/site-plots/?state=CO" target="_blank">for Colorado</a>. Stations without data for minimum and maximum historical values are excluded from this project. Note that station data is not uniform. Some stations started after 1991 and do not have the same number of years included in their 1991-2020 median. Meltout dates are calculated by flagging the first instance of 0 SWE for a station after the snow season and does not take into account for re-accumulations, where a station hits zero and then gets snow again.</p>


    </div>
</div>
</main>

<style>
    #station-map {
        height: 400px;
        width: 100%;
        border-radius: 6px;
        margin-bottom: 0.25rem;
        z-index: 0;
    }

    #map-legend {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        font-size: 0.75rem;
        margin-bottom: 1rem;
        min-height: 30px;
    }

    #map-legend-bar-container {
        margin-bottom:10px;
        max-width: 220px;
    }


    .map-legend-caption {
        color: #555;
        font-size: 1.1em;
        text-align: center;
    }

    #snowpack-chart-container {
        min-height: 400px;
        width: 100%;
        position: relative;
    }

    :global(.d3-theme .series-area) {
        fill: #e0e0e0;
        /* opacity: .8 */
    }

    :global(.tooltip-box div) {
        margin-top: 5px;
    }

    :global(.tooltip-text) {
        width: fit-content;
        padding: 2px 4px;
        color: white;
        border-radius: 4px;
    }

    #story-container p {
        margin-top: 20px;
    }

    #story-container span.bg-current,
    #story-container span.bg-gray,
    #story-container span.bg-max,
    #story-container span.bg-min,
    span.bg-span {
        padding: 2px 4px;
        color: white;
        border-radius: 4px;
    }

    .dynamic-text {
        margin: 3rem 0;
    }

    .bg-gray {
        background-color: #e0e0e0;
        color: black !important;
    }

    .graphic-group {
        margin-top: 40px;
    }

    #chart-legend {
        display: flex;
        flex-direction: column;
        font-size: 0.8rem;
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        color: #555;
    }

    .legend-swatch {
        display: inline-block;
        width: 20px;
        height: 14px;
        border-radius: 2px;
    }

    .legend-circle {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 7px;
    }

    .legend-line-dotted {
        display: inline-block;
        width: 20px;
        height: 0;
        border-top: 2px dashed;
    }

    .legend-line {
        display: inline-block;
        width: 20px;
        height: 0;
        border-top: 2px solid;
    }

    .select {
        background-color: #ffffff;
        border-radius: 4px;
        padding: 2px 0;
    }
</style>