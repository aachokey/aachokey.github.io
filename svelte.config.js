import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
	  adapter: adapter({
		pages: 'build',
		assets: 'build',
		fallback: null,
		precompress: false,
		strict: true
	  }),
	  paths: {
		// If deploying to https://username.github.io/repo-name/
		// base: '/repo-name'
		// If deploying to https://username.github.io/ (user site)
		// leave base empty or remove this
	  }
	}
  };

export default config;
