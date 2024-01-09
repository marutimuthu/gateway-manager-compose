import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'EdgeOps',
			logo: {
				light: '/src/assets/logo-light.png',
				dark: '/src/assets/logo-dark.png',
				replacesTitle: true,
			},
			social: {
				github: 'https://github.com/withastro/starlight',
			},
			sidebar: [
				{
					label: 'Overview',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'About', link: '/guides/overview/' },
						{ label: 'Software Architecture', link: '/guides-copy/example/' },
						{ label: 'Performance', link: '/guides-copy/example/' },
						{ label: 'Security', link: '/guides-copy/example/' },
					],
				},
				{
					label: 'Getting Started',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Setup', link: '/getting-started/setup/' },
						{ label: 'Instance Registeration', link: '/guides-copy/example/' },
					],
				},
				{
					label: 'Features',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Create User Group', link: '/guides-copy/example/' },
						{ label: 'Add Users', link: '/guides-copy/example/' },
					],
				},
				{
					label: 'Other Services',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Creating Custom Data Flows', link: '/guides-copy/example/' },
						{ label: 'Create Visualisation Dashboards', link: '/guides-copy/example/' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
