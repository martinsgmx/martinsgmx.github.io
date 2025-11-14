// toggle-proxy.ts
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Compatible with ES module __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const configPath = path.resolve(__dirname, '../src/config.ts')
const proxyPath = path.resolve(__dirname, '../src/pages/api/proxy.ts')
const backupPath = path.resolve(__dirname, '../src/pages/api/proxy.ts.bak')
const astroConfigPath = path.resolve(__dirname, '../astro.config.ts')

// Read config.ts content
const configContent = fs.readFileSync(configPath, 'utf-8')

// Use regex to extract linkCard config (assuming the format does not change)
const match = configContent.match(/linkCard:\s*(true|false)/)
if (!match) {
  console.error('linkCard config not found')
  process.exit(1)
}
const linkCardEnabled: boolean = match[1] === 'true'

// Helper to comment/uncomment adapter lines in astro.config.ts
function toggleAstroAdapter(comment: boolean) {
  // For GitHub Pages static deployment, we don't need any adapter
  // This function is kept for compatibility but does nothing
  console.log('🔧 Using static build for GitHub Pages (no adapter needed)')
}

if (!linkCardEnabled) {
  // If linkCard is disabled, rename proxy.ts
  if (fs.existsSync(proxyPath)) {
    fs.renameSync(proxyPath, backupPath)
    console.log('🟡 proxy.ts disabled')
  }
  toggleAstroAdapter(true)
} else {
  // If linkCard is enabled, restore proxy.ts
  if (fs.existsSync(backupPath)) {
    fs.renameSync(backupPath, proxyPath)
    console.log('🟢 proxy.ts enabled')
  }
  toggleAstroAdapter(false)
}
