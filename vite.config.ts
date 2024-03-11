/// <reference types="vitest" />
import { join, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import { peerDependencies } from './package.json'

export default defineConfig({
	plugins: [
		react(),
		dts({ rollupTypes: true }), // Output .d.ts files
	],
	build: {
		target: 'esnext',
		minify: false,
		lib: {
			entry: resolve(__dirname, join('src', 'index.ts')),
			formats: ['es'],
			fileName(format, entryName) {
				return `${entryName}.${format}.js`
			},
		},
		rollupOptions: {
			// Exclude peer dependencies from the bundle to reduce bundle size
			external: [...Object.keys(peerDependencies)],
		},
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./tests/setup-test-env.ts'],
		coverage: {
			all: false,
			enabled: true,
		},
	},
})
