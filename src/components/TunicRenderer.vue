<!--
  Invariants expected in the methods below:
    - `self` refs should always be DOM `Element`s, and
    - `children` refs should always appear in a v-for and be `TunicRenderer`s.
-->
<template>
  <component v-if="render.container" :is="render.container" :href="render.href" :title="render.title" :target="render.target">
    <TunicRenderer v-for="(child, index) of node.children"
      :key="index" :node="child" :settings="settings" :ref="e => children[index] = e"
      @change="forwardUpdate" @settingsChange="forwardSettingsChange" />
  </component>
  <component v-else-if="render.single" :is="render.single" ref="self" />
  <span v-else-if="render.text" ref="self">{{ render.text }}</span>
  <TunicRenderer v-else-if="render.container === ''" v-for="(child, index) of node.children"
    :key="index" :node="child" :settings="settings" :ref="e => children[index] = e"
    @change="forwardUpdate" @settingsChange="forwardSettingsChange" />
  <div v-else-if="render.glyphs" ref="self" class="dropdown" :class="{ 'is-hoverable': !render.asKnown }">
    <span class="dropdown-trigger" :class="{ 'known': render.asKnown }" tabindex="0" @blur="focus = false" @focus="focus = true">
      <TunicWord v-if="focus" :word="render.glyphs" :scale="2" @change="updateWord" @hover="onHover" />
      <template v-else-if="render.asKnown">{{ render.asKnown }}</template>
      <TunicWord v-else :word="render.glyphs" :scale="1" @hover="onHover" disabled />
    </span>
    <div class="dropdown-menu">
      <div class="dropdown-content">
        <div v-for="(comp, compIndex) in glyphComponents" :key="compIndex" class="dropdown-item">
          <TunicWord :word="comp.glyph" :scale=".6" disabled /> <b>{{ comp.mnemonic }}</b> <em>{{ comp.description }}</em>
        </div>
        <div class="dropdown-item">
          <b>{{ render.glyphs }}</b>
        </div>
      </div>
    </div>
  </div>
  <p v-else-if="render.defn" ref="self">
    <TunicWord :word="render.defn" disabled :scale="1" />: {{ render.value }}
  </p>
  <pre v-else-if="render.code" ref="self">{{ node.value }}</pre>
  <div v-else-if="render.settings" class="box" ref="self">
    <SettingsEditor :settings="render.settings" @change='settingsChanged' />
  </div>
  <span v-else-if="render.warn" class="warn" ref="self">{{ render.warn }}</span>
</template>

<script setup>
import { ref, computed } from 'vue'
import { decompose, readWord } from '../tunic/composition'
import * as Glyph from '../tunic/glyph'
import TunicWord from './TunicWord.vue'
import SettingsEditor from './SettingsEditor.vue'

/* global defineProps, defineEmits */
const props = defineProps(['node', 'settings'])
const emit = defineEmits(['change', 'settingsChange'])

const self = ref(null)
// This should be an array managed by Vue but I seem to have found a bug
// I should check if there is already a bug report
const children = ref({})

const focus = ref(false)
const hoverGlyph = ref('')

const onHover = e => {
  if (e && e.code) {
    hoverGlyph.value = e.code
  }
}

const render = computed(() => {
  // See https://github.com/syntax-tree/mdast
  switch (props.node.type) {
    case 'root':
      return { container: '' }

    case 'link': // Just skip links at least for now
      return { container: 'a', href: props.node.url, title: props.node.title, target: '_blank' }

    case 'paragraph':
      return { container: 'p' }

    case 'heading': {
      const depth = props.node.depth | 0
      return { container: depth > 0 && depth <= 6 ? 'h' + depth : 'h2' }
    }

    case 'thematicBreak':
      return { single: 'hr' }

    case 'blockquote':
      return { container: 'blockquote' }

    case 'list':
      return { container: props.node.ordered ? 'ol' : 'ul' }

    case 'listItem':
      return { container: 'li' }

    case 'html':
      if (props.node.value === '<br>') {
        return { single: 'br' }
      } else {
        return { text: props.node.value }
      }

    case 'text':
      return { text: props.node.value }

    case 'code':
      if (props.node.lang === 'settings') {
        try {
          const content = props.node.value.trim()
          return { settings: content ? JSON.parse(content) : {} }
        } catch (e) {
          return { warn: `Parse error in settings: ${e.message}` }
        }
      } else {
        return { code: true }
      }

    case 'emphasis':
      return { container: 'em' }

    case 'strong':
      return { container: 'strong' }

    case 'inlineCode': {
      const glyphs = readWord(props.node.value, props.settings)
      return {
        glyphs,
        asKnown: !focus.value && props.settings.showTranslations && props.settings.definitions[glyphs]
      }
    }

    case 'break':
      return { single: 'br' }

    case 'definition':
      return props.settings.showDefinitions
        ? { defn: readWord(props.node.label, props.settings), value: props.node.url }
        : {}

    default:
      return { warn: `Unsupported content (${props.node.type})` }
  }
})

const glyphComponents = computed(() =>
  decompose(hoverGlyph.value || Glyph.EMPTY_GLYPH, props.settings)
)

const updateWord = value => emit('change', { position: props.node.position, value })
const forwardUpdate = e => emit('change', e)

const settingsChanged = settings => {
  emit('settingsChange', {
    position: props.node.position,
    value: settings
  })
}
const forwardSettingsChange = e => emit('settingsChange', e)

const hasChildren = () => !!props.node.children

const scrollToLine = line => {
  if (self.value) {
    self.value.scrollIntoView()
  } else if (hasChildren()) {
    // Assume ast nodes are ordered in a strictly ascending order
    for (let i = 0; i < props.node.children.length; ++i) {
      // First node whose end is past the target line gets selected
      if (props.node.children[i].position.end.line >= line) {
        children.value[i].scrollToLine(line)
        return
      }
    }
    // Fallback to the last child
    children.value[props.node.children.length - 1].scrollToLine(line)
  }
}

const queryFirstLineVisibleIn = rect => {
  if (self.value) {
    return props.node.position.start.line
  } else if (hasChildren()) {
    for (let i = 0; i < props.node.children.length; ++i) {
      const child = children.value[i]
      if (child.isVisibleInRect(rect)) {
        return child.queryFirstLineVisibleIn(rect)
      }
    }
    // Fallback
    return children.value[props.node.children.length - 1].queryFirstLineVisibleIn(rect)
  }
}

const isVisibleInRect = rect => {
  if (self.value) {
    const selfRect = self.value.getBoundingClientRect()
    // Only the vertical axis check is really necessary, and we don't
    // care if the element is not visible because it is past the end of
    // the viewport.
    return selfRect.bottom > rect.top
  } else if (hasChildren()) {
    for (let i = 0; i < props.node.children.length; ++i) {
      if (children.value[i].isVisibleInRect(rect)) {
        return true
      }
    }
    return false
  }
}

/* global defineExpose */
defineExpose({ scrollToLine, queryFirstLineVisibleIn, isVisibleInRect })
</script>

<style scoped>
.warn {
  color: red;
  background-color: lightyellow;
}

.known {
  background-color: lightyellow;
}
</style>
