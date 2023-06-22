import { defineConfig } from 'vite'
import nodePolyfills from 'vite-plugin-node';
import viteNode from 'vite-plugin-node';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills, 
    viteNode,
    react(),
  ],
});
