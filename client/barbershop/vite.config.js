import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [react()],
		optimizeDeps: {
			exclude: ['lucide-react'],
		},
		server: {
			proxy: {
				'/api': {
					target: 'https://barberease-3kbc.onrender.com/',
					//target: 'http://127.0.0.1:5000',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
	};
});
