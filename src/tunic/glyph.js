import wu from 'wu'

// Glyphs are encoded with a modified base64 encoding; one glyph has 12 bits
// of data, so it is just represented as two base64 digits and there is no
// need for complements.
const BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

export const EMPTY_GLYPH = 'AA'

const WIDTH = 23
const HEIGHT = 35
const EXTRA_MATCH_WIDTH = 2

// Decode a single glyph from its base64 encoding to an integer
const decode = digits => BASE.indexOf(digits[0]) * 64 + BASE.indexOf(digits[1])
const encode = code => BASE[(code / 64) | 0] + BASE[code % 64]
const glyphCount = digits => (digits.length / 2) | 0

const glyphCodes = function * (word) {
  for (let i = 0; i < glyphCount(word); ++i) {
    yield decode(word.slice(2 * i, 2 * i + 2))
  }
}

// Callers may depend on the yield order
const componentStates = function * (code) {
  for (let i = 0; i < glyphComponents.length; ++i) {
    const active = (code >> i) & 1
    yield [glyphComponents[i], !!active, i]
  }
}

export const draw = (ctx, word, { highlight } = {}) => {
  ctx.save()
  ctx.lineCap = 'round'
  for (const code of glyphCodes(word)) {
    const byColor = { lightgray: [], lightgreen: [], black: [], green: [] }
    for (const [component, active] of componentStates(code)) {
      if (!active && !highlight) continue
      ctx.lineWidth += EXTRA_MATCH_WIDTH
      const highlightMatch = highlight && ctx.isPointInStroke(component, highlight.x, highlight.y)
      ctx.lineWidth -= EXTRA_MATCH_WIDTH
      byColor[active ? (highlightMatch ? 'green' : 'black') : (highlightMatch ? 'lightgreen' : 'lightgray')].push(component)
    }
    for (const color of ['lightgray', 'lightgreen', 'black', 'green']) {
      ctx.strokeStyle = color
      for (const component of byColor[color]) ctx.stroke(component)
    }
    ctx.translate(WIDTH, 0)
  }
  ctx.restore()
  ctx.stroke(wordGrouping(glyphCount(word)))
}

export const getMask = (ctx, word, position) => {
  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineWidth += EXTRA_MATCH_WIDTH
  const resultArr = []
  for (const _ of glyphCodes(word)) {
    let newCode = 0
    for (const [component, , i] of componentStates(EMPTY_GLYPH)) {
      newCode |= ctx.isPointInStroke(component, position.x, position.y) << i
    }
    resultArr.push(encode(newCode))
    ctx.translate(WIDTH, 0)
  }
  ctx.restore()
  return resultArr.join('')
}

export const toggle = (ctx, word, position) => {
  const mask = getMask(ctx, word, position)
  if (/^A*$/.test(mask)) return word
  const maskHasInactiveComponents = wu
    .zip(glyphCodes(word), glyphCodes(mask))
    .some(([wordCode, maskCode]) => (wordCode & maskCode) !== maskCode)

  if (maskHasInactiveComponents) {
    return wu.zip(glyphCodes(word), glyphCodes(mask))
      .map(([wordCode, maskCode]) => encode(wordCode | maskCode))
      .toArray().join('')
  } else {
    return wu.zip(glyphCodes(word), glyphCodes(mask))
      .map(([wordCode, maskCode]) => encode(wordCode & ~maskCode))
      .toArray().join('')
  }
}

export const wordSize = word => ({
  width: glyphCount(word) * WIDTH,
  height: HEIGHT
})

const glyphComponents = [
  new Path2D('M 0 6 L 0 24'),
  new Path2D('M 0 6 L 11 0'),
  new Path2D('M 11 0 L 22 6'),
  new Path2D('M 0 6 L 11 12 L 11 15'),
  new Path2D('M 11 15 L 11 12 L 22 6'),
  new Path2D('M 11 0 L 11 15'),
  new Path2D('M 0 24 L 11 18'),
  new Path2D('M 11 18 L 22 24'),
  new Path2D('M 0 24 L 11 30'),
  new Path2D('M 11 30 L 22 24'),
  new Path2D('M 11 18 L 11 30'),
  (() => {
    const path = new Path2D()
    path.arc(11, 32, 2, 0, Math.PI * 2)
    return path
  })()
]

const wordGrouping = n => {
  const path = new Path2D()
  path.moveTo(0, 15)
  path.lineTo(n * WIDTH, 15)
  return path
}
