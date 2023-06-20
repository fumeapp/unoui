import { defineConfig, presetTypography } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // include js/ts files
        'src/**/*.{js,ts}',
        'docs/content/**/*.md',
      ]
    }
  },
  presets: [
    presetTypography({
      cssExtend: {
        'h1 a, h2 a, h3 a, h4 a': {
            borderBottom: 'none !important',
            color: 'inherit',
            fontWeight: 'inherit'
          },
          a: {
            textDecoration: 'none',
            borderBottom: '1px solid transparent'
          },
          'a:hover': {
            borderColor: 'var(--tw-prose-links)'
          },
          'a:has(> code)': {
            borderColor: 'transparent !important'
          },
          'a code': {
            color: 'var(--tw-prose-code)',
            border: '1px dashed var(--tw-prose-pre-border)'
          },
          'a:hover code': {
            color: 'var(--tw-prose-links)',
            borderColor: 'var(--tw-prose-links)'
          },
          pre: {
            margin: '0',
            borderRadius: '0.375rem',
            border: '1px solid var(--tw-prose-pre-border)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          },
          code: {
            backgroundColor: 'var(--tw-prose-pre-bg)',
            padding: '0.25rem 0.375rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--tw-prose-pre-border)'
          },
          'code::before': {
            content: ''
          },
          'code::after': {
            content: ''
          },
          'blockquote p:first-of-type::before': {
            content: ''
          },
          'blockquote p:last-of-type::after': {
            content: ''
          },
          'input[type="checkbox"]': {
            color: 'rgb(var(--color-primary-500))',
            borderColor: 'rgb(var(--color-gray-300))',
            marginTop: '-3.5px !important',
            marginBottom: '0 !important',
            '&:focus': {
              '--tw-ring-offset-width': 0
            }
          },
          'input[type="checkbox"]:checked': {
            borderColor: 'rgb(var(--color-primary-500))'
          },
          'input[type="checkbox"]:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed'
          },
          'ul.contains-task-list': {
            marginLeft: '-1.625em'
          },
          'ul ul': {
            paddingLeft: '1.625em'
          },
          'ul ol': {
            paddingLeft: '1.625em'
          },
          'ul > li.task-list-item': {
            paddingLeft: '0 !important'
          },
          'ul > li.task-list-item input': {
            marginRight: '7px'
          },
          'ul > li.task-list-item > ul.contains-task-list': {
            marginLeft: 'initial'
          },
          'ul > li.task-list-item a': {
            marginBottom: 0
          },
          'ul > li.task-list-item::marker': {
            content: 'none'
          },
          'ul > li > p': {
            margin: 0
          },
          'ul > li > span.issue-badge, p > span.issue-badge': {
            verticalAlign: 'text-top',
            margin: '0 !important'
          },
          'ul > li > button': {
            verticalAlign: 'baseline !important'
          },
          table: {
            wordBreak: 'break-all'
          },
      },
    }),
  ]
 })
