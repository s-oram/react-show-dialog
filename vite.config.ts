/// <reference types="vitest" />
import { join, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json' assert { type: 'json' }

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
			external: [
				'react/jsx-runtime', // Required to prevent `react` from being included in build.
				...Object.keys(pkg.peerDependencies),
			],
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
