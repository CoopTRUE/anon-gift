import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()]
})


// O(log n) bundle time but not worth compute time for now
/* thx https://sambitsahoo.com/blog/vite-code-splitting-that-works.html
// import { dependencies } from './package.json';
function renderChunks(deps) {
    let chunks = {};
    Object.keys(deps).forEach((key) => {
        if (['react', 'react-router-dom', 'react-dom'].includes(key)) return;
        chunks[key] = [key];
    });
    return chunks;
}
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-router-dom', 'react-dom'],
                    ...renderChunks(dependencies),
                },
            },
        },
    },
}) */