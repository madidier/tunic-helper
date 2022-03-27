<template>
  <canvas ref="canvas" :width="size.width" :height="size.height"
    @mousemove="e => highlight = { x: e.offsetX, y: e.offsetY }"
    @mouseleave="highlight = null"
    @click="e => toggle(e.offsetX, e.offsetY)" />
</template>

<script>
import Glyph from '../tunic/glyph'

const PADDING = 2
const SCALE = 1.5

export default {
  props: ['word'],

  data () {
    return {
      highlight: null
    }
  },

  computed: {
    size () {
      const rawSize = Glyph.wordSize(this.word)
      const f = x => (x + 2 * PADDING) * SCALE
      return { width: f(rawSize.width), height: f(rawSize.height) }
    },

    canvasContext () {
      return this.$refs.canvas && this.$refs.canvas.getContext('2d')
    }
  },

  methods: {
    draw () {
      this.runCanvas(ctx => Glyph.draw(ctx, this.word, { highlight: this.highlight }))
    },

    toggle (x, y) {
      this.runCanvas(ctx => {
        const word = Glyph.toggle(ctx, this.word, { x, y })
        if (word !== this.word) {
          this.$emit('change', word)
        }
      }, false)
    },

    runCanvas (f, clear = true) {
      const ctx = this.canvasContext
      if (clear) {
        ctx.clearRect(0, 0, this.size.width, this.size.height)
      }
      ctx.save()
      ctx.lineWidth = 2
      ctx.scale(SCALE, SCALE)
      ctx.translate(PADDING, PADDING)
      f(ctx)
      ctx.restore()
    }
  },

  watch: {
    word () {
      this.$nextTick(() => this.draw())
    },

    highlight () {
      this.draw()
    }
  },

  mounted () {
    this.draw()
  }
}
</script>

<style scoped>
canvas {
  vertical-align: middle;
}
</style>
