<template>
  <component v-if="render.container" :is="render.container">
    <TunicRenderer v-for="(child, index) of node.children"
      :key="index" :node="child" :definitions="definitions" ref="children"
      @change="c => updateChild(index, c)" />
  </component>
  <component v-else-if="render.single" :is="render.single" ref="self" />
  <span v-else-if="render.text" ref="self">{{ render.text }}</span>
  <TunicRenderer v-else-if="render.container === ''" v-for="(child, index) of node.children"
    :key="index" :node="child" :definitions="definitions" ref="children"
    @change="c => updateChild(index, c)" />
  <span v-else-if="render.glyphs" ref="self">
    <TunicWord :word="render.glyphs" :scale="hover ? 1.5 : 1"
      @mouseenter="hover = true" @mouseleave="hover = false"
      @change="w => updateValue(w)"
      />
  </span>
  <span class="known" v-else-if="render.known" @mouseenter="hover = true" ref="self">{{ render.known }}</span>
  <p v-else-if="render.defn">
    <TunicWord :word="render.defn" disabled :scale="1" ref="self" />: {{ render.value }}
  </p>
  <pre v-else-if="render.code" ref="self">{{ node.value }}</pre>
  <span v-else-if="render.warn" class="warn" ref="self">{{ render.warn }}</span>
</template>

<script>
import TunicWord from './TunicWord.vue'

export default {
  components: {
    TunicWord
  },
  props: ['node', 'definitions'],
  emits: ['change'],

  data () {
    return {
      hover: false
    }
  },

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

        case 'inlineCode': {
          const glyphs = this.node.value
          const known = !this.hover && this.definitions[glyphs]
          return known ? { known } : { glyphs }
        }

        case 'break':
          return { single: 'br' }

        case 'definition':
          return { defn: this.node.label, value: this.node.url }

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
      children[index] = value
      this.$emit('change', { ...this.node, children })
    },

    scrollToLine (line) {
      if (this.$refs.self) {
        // Invariant: self refs are regular HTML `Element`s
        this.$refs.self.scrollIntoView()
      } else if (this.$refs.children) {
        // Assume ast nodes are ordered in a strictly ascending order
        // Also, the invariant that all children are `TunicRenderer`s should be maintained
        for (let i = 0; i < this.$refs.children.length; ++i) {
          // First node whose end is past the target line gets selected
          if (this.node.children[i].position.end.line >= line) {
            this.$refs.children[i].scrollToLine(line)
            return
          }
        }
        // Fallback to the last child
        this.$refs.children[this.$refs.children.length - 1].scrollToLine(line)
      }
    },

    // FIXME: This code is clumsy and might be unnecessarily inefficient
    queryFirstLineVisibleIn (rect) {
      // Same invariants as in the scrollToLine method
      if (this.$refs.self) {
        return this.node.position.start.line
      } else if (this.$refs.children) {
        for (const child of this.$refs.children) {
          if (child.isVisibleInRect(rect)) {
            return child.queryFirstLineVisibleIn(rect)
          }
        }
        // Fallback
        return this.$refs.children[this.$refs.children.length - 1].queryFirstLineVisibleIn(rect)
      }
    },

    isVisibleInRect (rect) {
      // Same invariants as in the scrollToLine method
      if (this.$refs.self) {
        const selfRect = this.$refs.self.getBoundingClientRect()
        // Only the vertical axis check is really necessary, and we don't
        // care if the element is not visible because it is past the end of
        // the viewport.
        return selfRect.bottom > rect.top
      } else if (this.$refs.children) {
        return this.$refs.children.some(child => child.isVisibleInRect(rect))
      }

      // Looks like we are not being rendered for some reason *shrug*
      debugger
    }
  }
}
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
