<!--
  Invariants expected in the methods below:
    - `self` refs should always be DOM `Element`s, and
    - `children` refs should always appear in a v-for and be `TunicRenderer`s.
-->
<template>
  <component v-if="render.container" :is="render.container">
    <TunicRenderer v-for="(child, index) of node.children"
      :key="index" :node="child" :definitions="definitions" :ref="e => children[index] = e"
      @change="forwardUpdate" />
  </component>
  <component v-else-if="render.single" :is="render.single" ref="self" />
  <span v-else-if="render.text" ref="self">{{ render.text }}</span>
  <TunicRenderer v-else-if="render.container === ''" v-for="(child, index) of node.children"
    :key="index" :node="child" :definitions="definitions" :ref="e => children[index] = e"
    @change="forwardUpdate" />
  <span v-else-if="render.glyphs" ref="self" tabindex="0"
    @blur="focus = false" @focus="focus = true">
    <!-- the :key attribute keeps click events from misfiring when clicking on a word to focus it.
         it forces Vue.js to recreate a new DOM canvas so that the mousedown and mouseup events happen on distinct elements -->
    <TunicWord :word="render.glyphs" :scale="focus ? 2 : 1" :disabled="!focus" :key="focus ? 'focused-word' : 'blured-word'"
      @change="updateWord"
      />
  </span>
  <span class="known" v-else-if="render.known" @focus="onKnownFocus" ref="self" tabindex="0">{{ render.known }}</span>
  <p v-else-if="render.defn" ref="self">
    <TunicWord :word="render.defn" disabled :scale="1" />: {{ render.value }}
  </p>
  <pre v-else-if="render.code" ref="self">{{ node.value }}</pre>
  <span v-else-if="render.warn" class="warn" ref="self">{{ render.warn }}</span>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import TunicWord from './TunicWord.vue'

/* global defineProps, defineEmits */
const props = defineProps(['node', 'definitions'])
const emit = defineEmits(['change'])

const self = ref(null)
// This should be an array managed by Vue but I seem to have found a bug
// I should check if there is already a bug report
const children = ref({})

const focus = ref(false)
const onKnownFocus = () => {
  focus.value = true
  nextTick(() => {
    if (self.value) {
      self.value.focus()
    }
  })
}

const render = computed(() => {
  // See https://github.com/syntax-tree/mdast
  switch (props.node.type) {
    case 'root':
    case 'link': // Just skip links at least for now
      return { container: '' }

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
      return { code: true }

    case 'emphasis':
      return { container: 'em' }

    case 'strong':
      return { container: 'strong' }

    case 'inlineCode': {
      const glyphs = props.node.value
      const known = !focus.value && props.definitions[glyphs]
      return known ? { known } : { glyphs }
    }

    case 'break':
      return { single: 'br' }

    case 'definition':
      return { defn: props.node.label, value: props.node.url }

    default:
      return { warn: `Unsupported content (${props.node.type})` }
  }
})

const updateWord = value => emit('change', { position: props.node.position, value })
const forwardUpdate = e => emit('change', e)

const scrollToLine = line => {
  if (self.value) {
    self.value.scrollIntoView()
  } else {
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
  } else {
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
  } else {
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
