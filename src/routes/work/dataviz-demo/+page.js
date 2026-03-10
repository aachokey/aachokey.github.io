/** Sample data for the dataviz demo: map markers, bar chart, line chart */

export function load() {
	return {
		// Points for the map (city, lat, lng, label)
		mapMarkers: [
			{ city: 'Denver', lat: 39.7392, lng: -104.9903, value: 42 },
			{ city: 'Boulder', lat: 40.015, lng: -105.2705, value: 28 },
			{ city: 'Fort Collins', lat: 40.5853, lng: -105.0844, value: 35 },
			{ city: 'Colorado Springs', lat: 38.8339, lng: -104.8214, value: 31 }
		],
		// Bar chart: category + value
		barData: [
			{ label: 'Jan', value: 24 },
			{ label: 'Feb', value: 31 },
			{ label: 'Mar', value: 28 },
			{ label: 'Apr', value: 45 },
			{ label: 'May', value: 52 },
			{ label: 'Jun', value: 48 },
			{ label: 'Jul', value: 61 },
			{ label: 'Aug', value: 55 },
			{ label: 'Sep', value: 42 },
			{ label: 'Oct', value: 38 },
			{ label: 'Nov', value: 29 },
			{ label: 'Dec', value: 33 }
		],
		// Line chart: time series
		lineData: [
			{ month: 1, value: 4.2 },
			{ month: 2, value: 5.1 },
			{ month: 3, value: 7.0 },
			{ month: 4, value: 9.4 },
			{ month: 5, value: 12.1 },
			{ month: 6, value: 15.8 },
			{ month: 7, value: 18.2 },
			{ month: 8, value: 17.5 },
			{ month: 9, value: 14.0 },
			{ month: 10, value: 10.1 },
			{ month: 11, value: 6.3 },
			{ month: 12, value: 4.5 }
		]
	};
}
