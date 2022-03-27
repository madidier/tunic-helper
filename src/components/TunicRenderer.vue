<template>
  <component v-if="render.container" :is="render.container">
    <TunicRenderer v-for="(child, index) of node.children"
      :key="index" :node="child"
      @change="c => updateChild(index, c)" />
  </component>
  <component v-else-if="render.single" :is="render.single" />
  <template v-else-if="render.text">{{ render.text }}</template>
  <TunicRenderer v-else-if="render.container === ''" v-for="(child, index) of node.children"
    :key="index" :node="child"
    @change="c => updateChild(index, c)" />
  <TunicWord v-else-if="render.glyphs" :word="render.glyphs" @change="w => updateValue(w)" />
  <pre v-else-if="render.code">{{ node.value }}</pre>
  <span v-else-if="render.warn" class="warn">{{ render.warn }}</span>
</template>

<script>
import TunicWord from './TunicWord.vue'

export default {
  components: {
    TunicWord
  },
  props: ['node'],
  emits: ['change'],

  computed: {
    render () {
      // See https://github.com/syntax-tree/mdast
      switch (this.node.type) {
        case 'root':
        case 'link': // Just skip links at least for now
          return { container: '' }

        case 'paragraph':
          return { container: 'p' }

        case 'heading': {
          const depth = this.node.depth | 0
          return { container: depth > 0 && depth <= 6 ? 'h' + depth : 'h2' }
        }

        case 'thematicBreak':
          return { single: 'hr' }

        case 'blockquote':
          return { container: 'blockquote' }

        case 'list':
          return { container: this.node.ordered ? 'ol' : 'ul' }

        case 'listItem':
          return { container: 'li' }

        case 'html':
          if (this.node.value === '<br>') {
            return { single: 'br' }
          } else {
            return { text: this.node.value }
          }

        case 'text':
          return { text: this.node.value }

        case 'code':
          return { code: true }

        case 'emphasis':
          return { container: 'em' }

        case 'strong':
          return { container: 'strong' }

        case 'inlineCode':
          return { glyphs: this.node.value }

        case 'break':
          return { single: 'br' }

        default:
          return { warn: `Unsupported content (${this.node.type})` }
      }
    }
  },

  methods: {
    updateValue (value) {
      this.$emit('change', { ...this.node, value })
    },

    updateChild (index, value) {
      const children = this.node.children.slice()
      children.splice(index, 1, value)
      this.$emit('change', { ...this.node, children })
    }
  }
}
</script>

<style scoped>
.warn {
  color: red;
  background-color: lightyellow;
}
</style>
