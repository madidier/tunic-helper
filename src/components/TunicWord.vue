<template>
  <canvas ref="canvas" :width="size.width" :height="size.height"
    @mousemove="e => !disabled && (highlight = { x: e.offsetX, y: e.offsetY })"
    @mouseleave="highlight = null"
    @click="e => !disabled && toggle(e.offsetX, e.offsetY)" />
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import * as Glyph from '../tunic/glyph'

const PADDING = 2

/* global defineProps, defineEmits */
const props = defineProps({
  word: String,
  disabled: Boolean,
  scale: {
    type: Number,
    default: 1.5
  }
})
const emit = defineEmits(['change'])

const canvas = ref(null)
const highlight = ref(null)

const size = computed(() => {
  const rawSize = Glyph.wordSize(props.word)
  const f = x => (x + 2 * PADDING) * props.scale
  return { width: f(rawSize.width), height: f(rawSize.height) }
})

const runCanvas = (cb, clear = true) => {
  const ctx = canvas.value.getContext('2d')
  if (clear) {
    ctx.clearRect(0, 0, size.value.width, size.value.height)
  }
  ctx.save()
  ctx.lineWidth = 2
  ctx.scale(props.scale, props.scale)
  ctx.translate(PADDING, PADDING)
  try {
    return cb(ctx)
  } finally {
    ctx.restore()
  }
}

const draw = () => {
  runCanvas(ctx => Glyph.draw(ctx, props.word, { highlight: highlight.value }))
}

const toggle = (x, y) => {
  const word = runCanvas(ctx => Glyph.toggle(ctx, props.word, { x, y }), false)
  if (word !== props.word) {
    emit('change', word)
  }
}

// nextTick: make sure the DOM canvas' size is up to date before drawing
watch([() => props.word, size, highlight], () => {
  nextTick(() => {
    // First make sure the canvas didn't get destroyed in the meanwhile
    if (canvas.value) draw()
  })
})
onMounted(draw)
</script>

<style scoped>
canvas {
  vertical-align: middle;
}
</style>
