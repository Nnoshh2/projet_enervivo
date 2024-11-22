import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: "/projet_enervivo/",
    plugins: [react()],
});