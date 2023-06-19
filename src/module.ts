import { installModule } from '@nuxt/kit'
import { defineConfig } from 'unocss'
import presetIcons from '@unocss/preset-icons'
import { presetUno, presetWind, presetAttributify } from 'unocss'
import { defineNuxtModule, addPlugin, createResolver, addComponentsDir, resolvePath } from '@nuxt/kit'
import { name, version } from '../package.json'
import appConfig from './runtime/app.config'

type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> | { [key: string]: string } }>

declare module 'nuxt/schema' {
  interface AppConfigInput {
    ui?: {
      primary?: string
      gray?: string
      colors?: string[]
    } & DeepPartial<typeof appConfig.ui>
  }
}


// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
  * @default 'u'
  */
  prefix?: string

  /**
   * @default false
   */
  global?: boolean

  icons: string[] | string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'unoui',
    compatibility: {
      nuxt: '^3.0.0-rc.8'
    }
  },
  defaults: {
    prefix: 'U',
    icons: ['mdi'],
  },
  // Default configuration options of the Nuxt module
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const runtimeDir = resolver.resolve('./runtime')

    const appConfigFile = await resolvePath(resolver.resolve(runtimeDir, 'app.config'))
    nuxt.hook('app:resolve', (app) => {
      app.configs.push(appConfigFile)
    })

    await installModule('@unocss/nuxt', {
      preflight: true,
      presets: [presetUno(), presetWind(), presetAttributify(), presetIcons()],
      exposeConfig: true,
      content: [
        resolver.resolve(runtimeDir, 'components/**/*.{vue,mjs,ts}'),
        resolver.resolve(runtimeDir, '*.{mjs,js,ts}')
      ],
    })

    const globalColors = presetUno().theme?.colors

    if (globalColors)
      globalColors.primary = {
        50: 'rgb(var(--color-primary-50) / <alpha-value>)',
        100: 'rgb(var(--color-primary-100) / <alpha-value>)',
        200: 'rgb(var(--color-primary-200) / <alpha-value>)',
        300: 'rgb(var(--color-primary-300) / <alpha-value>)',
        400: 'rgb(var(--color-primary-400) / <alpha-value>)',
        500: 'rgb(var(--color-primary-500) / <alpha-value>)',
        600: 'rgb(var(--color-primary-600) / <alpha-value>)',
        700: 'rgb(var(--color-primary-700) / <alpha-value>)',
        800: 'rgb(var(--color-primary-800) / <alpha-value>)',
        900: 'rgb(var(--color-primary-900) / <alpha-value>)',
        950: 'rgb(var(--color-primary-950) / <alpha-value>)'
      }

    const colors = Object.keys(globalColors || {})

    nuxt.options.appConfig.ui = {
      ...nuxt.options.appConfig.ui,
      primary: 'green',
      gray: 'cool',
      colors: colors,
    }

    addComponentsDir({
      path: resolver.resolve(runtimeDir, 'components', 'elements'),
      prefix: options.prefix,
      global: options.global,
      watch: false
    })


    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))

  }
})
