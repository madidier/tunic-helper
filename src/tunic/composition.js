import * as Glyph from './glyph'

// Input settings are expected to have the following structure:
// const settings = {
//   masks: [ 'xx', 'yy', 'zz' ],
//   parts: [{
//     glyph: 'xx',
//     mnemonic: '-',
//     description: 'free text'
//   }, ...]
// }

// A compiled composition has the following structure:
// const composition = {
//   masks: [ 'xx', 'yy', 'zz' ],
//   glyphs: {
//     'xx': {
//       glyph: 'xx',
//       mnemonic: '-',
//       description: 'free text'
//     },
//     ...
//   },
//   mnemonics: {
//     '-': 'xx',
//     ...
//   }
// }

export const EMPTY = {
  masks: [],
  glyphs: {},
  mnemonics: {}
}

export const compile = ({ masks, parts }) => {
  const glyphs = {}
  const mnemonics = {}
  for (const part of parts || []) {
    glyphs[part.glyph] = {
      ...part,
      mnemonic: part.mnemonic || '=' + part.glyph
    }
    mnemonics[part.mnemonic] = part.glyph
  }
  return { masks: masks || [], glyphs, mnemonics }
}

export const maskIndex = (glyph, masks) => {
  if (glyph === Glyph.EMPTY_GLYPH) {
    return -1
  }
  for (let i = 0; i < masks.length; ++i) {
    if (Glyph.intersect(glyph, masks[i]) === glyph) {
      return i
    }
  }
  return -1
}

export const decompose = (glyph, composition) => {
  if (glyph === Glyph.EMPTY_GLYPH) {
    return [{
      glyph: Glyph.EMPTY_GLYPH,
      mnemonic: '',
      description: 'empty'
    }]
  }
  const result = []
  let unrecognized = glyph
  for (const mask of composition.masks) {
    const inter = Glyph.intersect(glyph, mask)
    if (inter !== Glyph.EMPTY_GLYPH && composition.glyphs[inter]) {
      result.push(composition.glyphs[inter])
      unrecognized = Glyph.subtract(unrecognized, inter)
    }
  }
  if (unrecognized !== Glyph.EMPTY_GLYPH) {
    const part = composition.glyphs[unrecognized]
    result.push({
      glyph: unrecognized,
      mnemonic: (part && part.mnemonic) || '=' + unrecognized,
      description: (part && part.description) || 'unknown'
    })
  }
  return result
}

export const compose = (phrase, composition) => {
  const word = []
  for (const mnemos of phrase.split(',')) {
    let glyph = Glyph.EMPTY_GLYPH
    for (const mnemo of mnemos.split(/\s+/)) {
      if (!mnemo) {
        continue
      } else if (composition.mnemonics[mnemo]) {
        glyph = Glyph.union(glyph, composition.mnemonics[mnemo])
      } else if (mnemo.length === 3 && mnemo[0] === '=') {
        glyph = Glyph.union(glyph, mnemo.slice(1))
      }
    }
    word.push(glyph)
  }
  return word.join('')
}

export const readWord = (codeOrPhrase, composition) =>
  codeOrPhrase.startsWith(':')
    ? compose(codeOrPhrase.slice(1), composition)
    : codeOrPhrase
