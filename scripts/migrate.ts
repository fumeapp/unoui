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
  rules.forEach((rule) => content = content.replaceAll(rule.pattern, rule.replacement))
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
  const docsRules: ReplacementRule[] = [
    {
    pattern: "import colors from '#tailwind-config/theme/colors'",
    replacement: "import { presetUno } from 'unocss'\r\nconst colors = presetUno().theme.colors",
    },
    {
      pattern: "import colors from 'tailwindcss/colors'",
      replacement: "import { presetUno } from 'unocss'\r\nconst colors = presetUno().theme.colors",
    },
    {
      pattern: "modules: [",
      replacement: "css: [ '@/assets/prose.css', ],\r\n  modules: [",
    },
    {
      pattern: "'@nuxtjs/plausible',",
      replacement: "",
    },
    {
     pattern: "739984",
      replacement: "967369",
    },
    {
      pattern: "NuxtLabs",
      replacement: "Uno",
    },
    {
      pattern: "@nuxthq/ui",
      replacement: "unoui",
    }
  ]

  copyFileRegex(
    path.join(__dirname, '../../ui/src/runtime/app.config.ts'),
    path.join(__dirname, '../src/runtime/app.config.ts'), [])
  copyFilesRegex('docs', docsRules)
    fs.mkdirSync(path.join(__dirname, '../docs/assets'), { recursive: true })
  copyFileRegex(
    path.join(__dirname, '../migrate/uno.config.ts'),
    path.join(__dirname, '../docs/uno.config.ts'), [])
  copyFileRegex(
    path.join(__dirname, '../migrate/assets-prose.css'),
    path.join(__dirname, '../docs/assets/prose.css'), [])
  copyFileRegex(
    path.join(__dirname, '../migrate/components-Logo.vue'),
    path.join(__dirname, '../docs/components/Logo.vue'), [])
  copyFileRegex(
    path.join(__dirname, '../migrate/1.getting-started-1.index.md'),
    path.join(__dirname, '../docs/content/1.getting-started/1.index.md'), [])

}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
