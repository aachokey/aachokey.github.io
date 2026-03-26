import tegnaStations from './tegna_stations.json';
import nexstarStations from './nexstar_stations.json';
import overlapCities from './overlap_markets.json'


export function load() {
	const getLng = (d) => d.lng ?? d.long;

	const normalizeTegna = (d) => ({
		company: 'TEGNA',
		cityState: d.city_state,
		lat: d.lat,
		lng: getLng(d),
		callSigns: d.call_signs
	});
	const normalizeNexstar = (d) => ({
		company: 'Nexstar',
		cityState: d.city_state,
		lat: d.lat,
		lng: getLng(d),
		callSigns: d.call_signs
	});
	const normalizeOverlap = (d) => ({
		company: 'Overlap',
		cityState: d.city_state,
		lat: d.lat,
		lng: getLng(d),
		tegnaCallSigns: d.tegna_call_signs,
		nexstarCallSigns: d.nexstar_call_signs
	});
	return {
		tegna: tegnaStations.map(normalizeTegna),
		nexstar: nexstarStations.map(normalizeNexstar),
		overlap: overlapCities.map(normalizeOverlap)
	};


}
