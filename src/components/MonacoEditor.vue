<template>
  <div ref="editorContainer"></div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as monaco from 'monaco-editor'

/* global defineProps, defineEmits */
const props = defineProps(['value'])
const emit = defineEmits(['change', 'scrollTopChange'])
const editorContainer = ref(null)
let editor = null

onMounted(() => {
  editor = monaco.editor.create(editorContainer.value, {
    value: props.value,
    language: 'markdown',
    automaticLayout: true,
    scrollBeyondLastLine: false,
    wordBasedSuggestions: false,
    wordWrap: 'on'
  })

  editor.onDidChangeModelContent(() => {
    const value = editor.getValue()
    if (value !== props.value) {
      emit('change', value)
    }
  })

  editor.onDidScrollChange(e => {
    if (e.scrollTopChanged) {
      emit('scrollTopChange', getTopLine())
    }
  })
})

onBeforeUnmount(() => {
  editor && editor.dispose()
  editor = null
})

watch(() => props.value, () => {
  if (editor.getValue() !== props.value) {
    editor.setValue(props.value)
  }
})

const getTopLine = () => editor.getVisibleRanges()[0].startLineNumber

const revealLine = line => {
  editor.revealRangeAtTop({
    startLineNumber: line,
    startColumn: 1,
    endLineNumber: line,
    endColumn: 1
  })
}

const applyUpdate = update => {
  editor.executeEdits('tunic-helper', [{
    range: {
      startLineNumber: update.position.start.line,
      startColumn: update.position.start.column,
      endLineNumber: update.position.end.line,
      endColumn: update.position.end.column
    },
    text: update.value
  }])
}

/* global defineExpose */
defineExpose({ revealLine, applyUpdate, getTopLine })

</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
}
</style>
