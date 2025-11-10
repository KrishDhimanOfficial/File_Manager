import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { jsxToolDevServer } from "@jsx-tool/jsx-tool/vite"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), jsxToolDevServer()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))