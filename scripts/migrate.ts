import * as fs from 'fs'
import * as path from 'path'

interface ReplacementRule {
  pattern: RegExp
  replacement: string
}

function copyFileRegex(src: string, dest: string, rules: ReplacementRule[]): void {
    const file = path.basename(src)
    fs.copyFileSync(src, dest)
    let content = fs.readFileSync(dest, 'utf-8')
    rules.forEach((rule) => content = content.replace(rule.pattern, rule.replacement))
    fs.writeFileSync(dest, content, 'utf-8')
    console.log(`Copied and applied replacements to ${file}`)
}

function copyFilesRegex(source: string, regex: ReplacementRule[]): void {
  const src = path.join(__dirname, '../../ui/' + source)
  const dest = path.join(__dirname, '../' + source)
  if (!fs.existsSync(dest))
    fs.mkdirSync(dest, { recursive: true })

  const files = fs.readdirSync(src)
  files.forEach((file) => {
    const sourcePath = path.join(src, file)
    const destinationPath = path.join(dest, file)
    copyFileRegex(sourcePath, destinationPath, regex)
  })

  console.log('All files copied and replacements applied successfully!')
}

async function main() {
  copyFilesRegex('src/runtime/components/elements', [])
  copyFileRegex(
    path.join(__dirname, '../../ui/src/runtime/app.config.ts'),
    path.join(__dirname, '../src/runtime/app.config.ts'), [])
  // copyFilesRegex('docs', [])
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
