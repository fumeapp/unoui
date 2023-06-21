import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [ presetUno(), presetIcons() ],
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // include js/ts files
        'src/**/*.{js,ts}',
        'content/**/*.md',
      ]
    }
  },
 })
