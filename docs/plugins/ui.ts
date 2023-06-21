import { hexToRgb } from "../../src/runtime/utils"
import { presetUno } from 'unocss'
const colors = presetUno().theme.colors

export default defineNuxtPlugin({
  enforce: 'post',
  setup () {
    const appConfig = useAppConfig()

    const root = computed(() => {
      const primary = colors[appConfig.ui.primary]
      const gray = colors[appConfig.ui.gray]

      return `:root {
        ${Object.entries(primary || colors.green).map(([key, value]) => `--color-primary-${key}: ${hexToRgb(value)};`).join('\n')}
        ${Object.entries(gray || colors.cool).map(([key, value]) => `--color-gray-${key}: ${hexToRgb(value)};`).join('\n')}
        }`
    })

    if (process.client) {
      watch(root, () => {
        window.localStorage.setItem('nuxt-ui-root', root.value)
      })

      appConfig.ui.primary = window.localStorage.getItem('nuxt-ui-primary') || appConfig.ui.primary
      appConfig.ui.gray = window.localStorage.getItem('nuxt-ui-gray') || appConfig.ui.gray
    }
    if (process.server) {
      useHead({
        script: [
          {
            innerHTML: `
                if (localStorage.getItem('nuxt-ui-root')) {
                  document.querySelector('style#nuxt-ui-colors').innerHTML = localStorage.getItem('nuxt-ui-root')
                }`.replace(/\s+/g, ' '),
            type: 'text/javascript',
            tagPriority: -1
          }
        ]
      })
    }
  }
})
