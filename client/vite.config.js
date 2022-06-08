import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "~": resolve(__dirname, "node_modules"),
            "@": resolve(__dirname, "src"),
        },
    },
    build: {
        chunkSizeWarningLimit: 1600,
    },
});