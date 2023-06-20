
type SafeList = string[] | SafeRegex[]

interface SafeRegex {
  pattern: RegExp
  variants?: string[]
}

export const safelistRegexToStrings =  (safelist: SafeList) => {
  const safelistStrings: string[] = []
  for (const entry of safelist) {
    if (typeof entry === 'string') safelistStrings.push(entry)
    else safelistStrings.push(...generateColorStrings(entry))
  }
  return safelistStrings
}

function generateColorStrings(config: SafeRegex): string[] {
  const { pattern, variants } = config
  const patternString = pattern.toString()
  const prefixMatch = patternString.match(/\/([^/]+)-\(/)?.[1] || ''
  const colorsMatch = patternString.match(/\((.+?)\)/)?.[1] || ''
  const colors = colorsMatch.split('|')
  const suffixMatch = patternString.match(/-\d+/)?.[0] || ''

  const colorStrings: string[] = [];
  colors.forEach(color => {
    const colorString = `${prefixMatch}-${color}${suffixMatch}`
    colorStrings.push(colorString)
    if (!variants) return
    variants.forEach(variant => {
      const variantColorString = `${variant}:${colorString}`
      colorStrings.push(variantColorString)
    })
  })

  return colorStrings
}
