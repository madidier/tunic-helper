<template>
  <h4>General</h4>
  <p class="options">
    <label class="checkbox">
      <input type="checkbox" :checked="showTranslations" @change="e => setShowTranslations(e)"> Show translations
    </label>
    <label class="checkbox">
      <input type="checkbox" :checked="showDefinitions" @change="e => setShowDefinitions(e)"> Show definitions
    </label>
  </p>
  <h4>Glyph Masks</h4>
  <p class="masks">
    <span v-for="(mask, maskIndex) in settings.masks || []" :key="maskIndex"
      tabindex="0" @blur="focusedMask = -1" @focus="focusedMask = maskIndex">
      <TunicWord v-if="focusedMask !== maskIndex" :word="mask" :scale="1" disabled />
      <TunicWord v-else :word="mask" :scale="2" @change="v => updateMask(v, maskIndex)" />
    </span>
    <button class="button is-ghost"
      @click="addMask">
      Add
    </button>
    <button class="button is-ghost" v-if="settings.masks && settings.masks.length"
      @click="removeMask">
      Remove
    </button>
  </p>
  <h4>Glyph Parts</h4>
  <p class="parts">
    <template v-for="(part, partIndex) in settings.parts" :key="partIndex">
      <span tabindex="0" @blur="focusedPart = -1" @focus="focusedPart = partIndex">
        <TunicWord v-if="focusedPart !== partIndex" :word="part.glyph" :scale="1" disabled />
        <TunicWord v-else :word="part.glyph" :scale="2" @change="v => updatePartGlyph(v, partIndex)" />
      </span>
      <div class="field has-addons">
        <div class="control mnemo">
          <input class="input" type="text" placeholder="mnemonic" :value="part.mnemonic" @change="e => updateMnemo(e.target.value, partIndex)">
        </div>
        <div class="control is-expanded">
          <input class="input" type="text" placeholder="description" :value="part.description" @change="e => updateDescription(e.target.value, partIndex)">
        </div>
        <div class="control">
          <button class="button is-danger is-light" @click="removePart(partIndex)">Remove</button>
        </div>
      </div>
    </template>
  </p>
  <p>
    <button class="button is-ghost" @click="addPart">Add</button>
    <button v-show="settings.parts && settings.parts.length > 1" class="button is-ghost" @click="sortParts">Sort</button>
  </p>
  <div class="message">
    <div class="message-header">
      <p>Glyph Composition</p>
    </div>
    <div class="message-body">
      <p>
        Once your glyph parts are set up, you will be able to use them to
        input a Tunic word via the following syntax:
        <code>`: a b c, d e f`</code>.
      </p>
      <p>
        The colon <code>:</code> must appear right after the backtick
        <code>`</code> to indicate that you are composing a Tunic word from
        mnemonics. Each comma <code>,</code> separates one glyph from the
        next and mnemonics must be separated by spaces. Please note that
        mnemonics are case-sensitive.
      </p>
      <p>
        Your composition may include empty glyphs. For instance,
        <code>`:abc,,`</code> yields a three-glyph word where the first glyph
        corresponds to the mnemonic abc, and the second two are empty.
      </p>
      <p>
        It is also possible to input a glyph code as a mnemonic by prefixing
        it with an equal sign. For instance, <code>`:=xx,,,=bb`</code> is
        equivalent to <code>`xxAAAAbb`</code>.
      </p>
      <p>
        Glyph masks are necessary if you want tooltips to dissect a glyph into
        multiple parts.
      </p>
      <p>
        Parts are sorted by, in order: mask, mnemonic, and description. If
        there are duplicates, when displaying a tooltip, only the last matching
        part will be displayed.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { maskIndex } from '../tunic/composition'
import * as Glyph from '../tunic/glyph'
import TunicWord from './TunicWord.vue'

/* global defineProps, defineEmits */
const props = defineProps(['settings'])
const emit = defineEmits(['change'])

const showTranslations = computed(() =>
  'showTranslations' in props.settings
    ? props.settings.showTranslations
    : true
)

const showDefinitions = computed(() =>
  'showDefinitions' in props.settings
    ? props.settings.showDefinitions
    : true
)

const setShowTranslations = value => {
  emit('change', {
    ...props.settings,
    showTranslations: value.target.checked
  })
}

const setShowDefinitions = value => {
  emit('change', {
    ...props.settings,
    showDefinitions: value.target.checked
  })
}

const focusedMask = ref(-1)

const updateMask = (value, index) => {
  const masks = props.settings.masks.slice()
  masks[index] = value
  emit('change', { ...props.settings, masks })
}

const addMask = () => {
  const masks = (props.settings.masks && props.settings.masks.slice()) || []
  masks.push(Glyph.EMPTY_GLYPH)
  emit('change', { ...props.settings, masks })
}

const removeMask = () => {
  const masks = props.settings.masks.slice(0, props.settings.masks.length - 1)
  emit('change', { ...props.settings, masks })
}

const focusedPart = ref(-1)

const updatePart = field => (value, index) => {
  const parts = props.settings.parts.slice()
  parts[index] = { ...parts[index], [field]: value }
  emit('change', { ...props.settings, parts })
}

const updatePartGlyph = updatePart('glyph')
const updateMnemo = updatePart('mnemonic')
const updateDescription = updatePart('description')

const addPart = () => {
  const parts = (props.settings.parts && props.settings.parts.slice()) || []
  parts.push({ glyph: Glyph.EMPTY_GLYPH, mnemonic: '', description: '' })
  emit('change', { ...props.settings, parts })
}

const removePart = index => {
  const parts = props.settings.parts.slice()
  parts.splice(index, 1)
  emit('change', { ...props.settings, parts })
}

const sortParts = () => {
  const parts = props.settings.parts.slice()
  const { masks } = props.settings
  parts.sort((a, b) => {
    // NB: return 1 to place a below b, and vice versa with -1
    const maskA = maskIndex(a.glyph, masks)
    const maskB = maskIndex(b.glyph, masks)
    if (maskA !== maskB) {
      return maskA === -1 || (maskB !== -1 && maskA > maskB) ? 1 : -1
    }
    const mnemoCompare = a.mnemonic.localeCompare(b.mnemonic)
    if (mnemoCompare !== 0) {
      return mnemoCompare
    }
    return a.description.localeCompare(b.description)
  })
  emit('change', { ...props.settings, parts })
}

</script>

<style lang="sass" scoped>
.options
  display: flex
  flex-wrap: wrap
  gap: 1em

.masks
  display: flex
  flex-wrap: wrap
  align-items: center
  gap: .5em

.parts
  // TunicWord.vue: (<WIDTH|HEIGHT> + 2 * PADDING) * scale
  // glyphs are 23x35 (glyph.js)
  // padding is 2 (TunicWord.vue)
  // max scale used is 2
  display: grid
  grid-template-columns: repeat(auto-fill, ((23px + 4px) * 2) minmax(20em, 1fr))
  // grid-auto-rows: ((35px + 4px) * 2)
  place-items: center

  & .field
    width: 100%

.mnemo
  max-width: 8em
</style>
