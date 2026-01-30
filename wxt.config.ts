import react from "@vitejs/plugin-react"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import topLevelAwait from "vite-plugin-top-level-await"
import { defineConfig } from "wxt"

const chromeMV3Permissions = [
  "storage",
  "sidePanel",
  "activeTab",
  "scripting",
  "declarativeNetRequest",
  "unlimitedStorage",
  "contextMenus",
  "tts",
  "notifications"
]

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [
      react(),
      nodePolyfills({
        include: ["buffer", "stream", "util", "process"],
        globals: {
          Buffer: true,
          global: true,
          process: true
        }
      }),
      topLevelAwait({
        promiseExportName: "__tla",
        promiseImportName: (i) => `__tla_${i}`
      }) as any,
      {
        name: "wxt-conditional-manual-chunks",
        config(config: any) {
          if (config.build?.lib) {
            // Background and content scripts use lib mode with iife format, 
            // which doesn't support manualChunks/code-splitting.
            return;
          }

          return {
            build: {
              rollupOptions: {
                output: {
                  manualChunks(id: string) {
                    if (id.includes("node_modules")) {
                      if (
                        id.includes("antd") ||
                        id.includes("@ant-design") ||
                        id.includes("rc-")
                      ) {
                        return "vendor-antd"
                      }
                      if (id.includes("lucide-react")) {
                        return "vendor-lucide"
                      }
                      if (
                        id.includes("react-markdown") ||
                        id.includes("remark") ||
                        id.includes("rehype")
                      ) {
                        return "vendor-markdown"
                      }
                      if (id.includes("dexie")) {
                        return "vendor-dexie"
                      }
                      return "vendor"
                    }
                  }
                }
              }
            }
          }
        }
      }
    ]
  }),
  entrypointsDir: "entries",
  srcDir: "src",
  outDir: "build",

  manifest: {
    version: "1.5.50",
    name:
      process.env.TARGET === "firefox"
        ? "Page Assist - A Web UI for Local AI Models"
        : "__MSG_extName__",
    description: "__MSG_extDescription__",
    default_locale: "en",
    action: {},
    author: { email: "n4ze3m@example.com" },
    host_permissions:
      process.env.TARGET !== "firefox"
        ? ["http://*/*", "https://*/*", "file://*/*"]
        : undefined,
    commands: {
      _execute_action: {
        description: "Open the Web UI",
        suggested_key: {
          default: "Ctrl+Shift+L"
        }
      },
      execute_side_panel: {
        description: "Open the side panel",
        suggested_key: {
          default: "Ctrl+Shift+Y"
        }
      }
    },
    content_security_policy:
      process.env.TARGET !== "firefox"
        ? {
          extension_pages:
            "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
        }
        : undefined,
    permissions: chromeMV3Permissions
  }
}) as any