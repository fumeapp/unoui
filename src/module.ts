import { installModule } from '@nuxt/kit'
import { presetMini, presetUno, presetWind, presetAttributify, presetIcons } from 'unocss'
import { defineNuxtModule, addPlugin, createResolver, addComponentsDir, addImportsDir, resolvePath } from '@nuxt/kit'
import { name, version } from '../package.json'
import { generateSafelist, excludeColors } from './colors'
import { safelistRegexToStrings } from './unocss'
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

  safelistColors?: string[]
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
    safelistColors: ['primary']
  },
  // Default configuration options of the Nuxt module
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const runtimeDir = resolver.resolve('./runtime')

    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push('@popperjs/core', '@headlessui/vue')

    const appConfigFile = await resolvePath(resolver.resolve(runtimeDir, 'app.config'))
    nuxt.hook('app:resolve', (app) => {
      app.configs.push(appConfigFile)
    })

    const preset = presetUno()

    const globalColors:any = preset.theme?.colors
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

    // @ts-ignore
    globalColors.gray = {
      50: 'rgb(var(--color-gray-50) / <alpha-value>)',
      100: 'rgb(var(--color-gray-100) / <alpha-value>)',
      200: 'rgb(var(--color-gray-200) / <alpha-value>)',
      300: 'rgb(var(--color-gray-300) / <alpha-value>)',
      400: 'rgb(var(--color-gray-400) / <alpha-value>)',
      500: 'rgb(var(--color-gray-500) / <alpha-value>)',
      600: 'rgb(var(--color-gray-600) / <alpha-value>)',
      700: 'rgb(var(--color-gray-700) / <alpha-value>)',
      800: 'rgb(var(--color-gray-800) / <alpha-value>)',
      900: 'rgb(var(--color-gray-900) / <alpha-value>)',
      950: 'rgb(var(--color-gray-950) / <alpha-value>)'
    }


    if (preset.theme?.colors) preset.theme.colors = globalColors

    const colors = excludeColors(globalColors).filter(color =>
      ![
        'light-blue', 'lightblue', 'light', 'dark', 'warmgray', 'warm-gray',
        'truegray', 'true-gray', 'coolgray', 'cool-gray','bluegray', 'blue-gray'
      ].includes(color) )

    nuxt.options.appConfig.ui = {
      ...nuxt.options.appConfig.ui,
      primary: 'green',
      gray: 'slate',
      colors: colors,
    }

    if (preset.theme?.colors) {
      preset.theme.colors.primary = preset.theme.colors[nuxt.options.appConfig.ui.primary]
      preset.theme.colors.gray = preset.theme.colors[nuxt.options.appConfig.ui.gray]
    }

    const safelist = []
    safelist.push(...generateSafelist(colors))

    await installModule('@unocss/nuxt', {
      preflight: true,
      presets: [preset, presetMini(), presetWind(), presetAttributify(), presetIcons()],
      safelist: safelistRegexToStrings(safelist),
       content: {
         pipeline: {
          include: [
            /\.(vue)($|\?)/,
            'src/**/*.{mjs, js,ts}',
             resolver.resolve(runtimeDir, 'components/**/*.{vue,mjs,ts}'),
             resolver.resolve(runtimeDir, '*.{mjs,js,ts}'),
          ]
        },
      },
    })

    addComponentsDir({
      path: resolver.resolve(runtimeDir, 'components', 'elements'),
      prefix: options.prefix,
      global: options.global,
      watch: false
    })

    addImportsDir(resolver.resolve(runtimeDir, 'composables'))

    addPlugin({
      src: resolver.resolve(runtimeDir, 'plugins', 'colors')
    })


  }
})
