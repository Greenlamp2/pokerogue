import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export const defaultConfig = {
	plugins: [tsconfigPaths() as any, react()],
	server: { host: '0.0.0.0', port: 8000 },
	clearScreen: false,
	build: {
		minify: 'esbuild' as const,
		sourcemap: false,
	},
	rollupOptions: {
		onwarn(warning, warn) {
			// Suppress "Module level directives cause errors when bundled" warnings
			if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
				return;
			}
			warn(warning);
		},
	}
};


export default defineConfig(({mode}) => ({
	...defaultConfig,
	esbuild: {
		pure: mode === 'production' ? [ 'console.log' ] : [],
		keepNames: true,
	},
}));
