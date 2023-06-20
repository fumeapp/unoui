import * as fs from 'fs'
import * as path from 'path'

interface ReplacementRule {
  pattern: string
  replacement: string
}

function copyFileRegex(src: string, dest: string, rules: ReplacementRule[]): void {
  // ignore any src that matches node_modules or at the end of the folder
  if (src.match(/node_modules/) || src.match(/\.nuxt/)) return
  if (fs.lstatSync(src).isDirectory()) return rawCopyFilesRegex(src, dest, rules)
  const file = path.basename(src)
  fs.copyFileSync(src, dest)
  let content = fs.readFileSync(dest, 'utf-8')
  rules.forEach((rule) => content = content.replace(rule.pattern, rule.replacement))
  fs.writeFileSync(dest, content, 'utf-8')
  console.log(`Copied and applied replacements to ${file}`)
}

function rawCopyFilesRegex(src: string, dest: string, regex: ReplacementRule[]): void {
  if (!fs.existsSync(dest))
    fs.mkdirSync(dest, { recursive: true })

  const files = fs.readdirSync(src)
  files.forEach((file) => {
    const sourcePath = path.join(src, file)
    const destinationPath = path.join(dest, file)
    copyFileRegex(sourcePath, destinationPath, regex)
  })
}

function copyFilesRegex(source: string, regex: ReplacementRule[]): void {
  const src = path.join(__dirname, '../../ui/' + source)
  const dest = path.join(__dirname, '../' + source)
  rawCopyFilesRegex(src, dest, regex)
  console.log('All files copied and replacements applied successfully!')
}

async function main() {
  copyFilesRegex('src/runtime/components', [])
  const colorsRules: ReplacementRule[] = [
    {
    pattern: "import colors from '#tailwind-config/theme/colors'",
    replacement: "import { presetUno } from 'unocss'\r\nconst colors = presetUno().theme.colors",
    },
    {
      pattern: "import colors from 'tailwindcss/colors'",
      replacement: "import { presetUno } from 'unocss'\r\nconst colors = presetUno().theme.colors",
    },
  ]
  copyFileRegex(
    path.join(__dirname, '../../ui/src/runtime/app.config.ts'),
    path.join(__dirname, '../src/runtime/app.config.ts'), []),
  copyFilesRegex('docs', colorsRules)
  // copy migrate/docs-prose.css to docs/assets/prose.css
  // copy migrate/components-Logo.vue to docs/components/Logo.vue
  /* inject  css:
  export default defineNuxtConfig({
    css: [ '@/assets/docs.css', ],
    // @ts-ignore
    modules: [
  */
    // remove '@nuxtjs/plausible' dfrom docs/nuxt.config.ts,
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
