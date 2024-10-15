import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react() , nodePolyfills()],
  define: {
    "process.env": {
      CLIENT_ID: "39b67f86ea8b9955ef27bddc46f6b84e",
      SECRET_KEY: "JeIedZ_SX6Z3VbZj3sbsw4_vPWlKVAwGO5YTFtglY3e0463F6eH37AwDuk8cpokwgKLKQ50DLFaPtPStLn_Sng",
    },
  },
})
