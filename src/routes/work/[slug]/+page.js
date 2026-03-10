import { projects } from '../projects.js';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const project = projects.find((p) => p.slug === params.slug);
	if (!project) {
		throw error(404, 'Project not found');
	}
	return { project };
}