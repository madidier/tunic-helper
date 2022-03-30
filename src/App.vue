<template>
  <div class="pure-menu pure-menu-horizontal">
    <span class="pure-menu-heading">Glyph Helper</span>
    <ul class="pure-menu-list">
      <li class="pure-menu-item" :class="{ 'pure-menu-selected': currentView === 'show-input' }">
        <a class="pure-menu-link" href="#" @click="currentView='show-input'">
          Input
        </a>
      </li>
      <li class="pure-menu-item" :class="{ 'pure-menu-selected': currentView === 'show-rendered' }">
        <a class="pure-menu-link" href="#" @click="currentView='show-rendered'">
          Rendered
        </a>
      </li>
      <li class="pure-menu-item" :class="{ 'pure-menu-selected': currentView === 'show-both' }">
        <a class="pure-menu-link" href="#" @click="currentView='show-both'">
          Both
        </a>
      </li>
    </ul>
  </div>
  <div class="pure-g main" :class="currentView">
    <div class="input pure-u-1" :class="{ 'pure-u-lg-1-2': currentView === 'show-both' }">
      <div class="editor-wrapper">
        <MonacoEditor :value="code" @change="value => code = value" @scrollTopChange="line => scrollRenderer(line)" ref="editor" />
      </div>
    </div>
    <div class="rendered pure-u-1" :class="{ 'pure-u-lg-1-2': currentView === 'show-both' }" ref="rendererContainer">
      <TunicRenderer :node="markdownAst" :definitions="definitions" ref="renderer" @change="ast => updateCode(ast)" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import MonacoEditor from './components/MonacoEditor.vue'
import TunicRenderer from './components/TunicRenderer.vue'
import { remark } from 'remark'
import { visit } from 'unist-util-visit'
import * as monaco from 'monaco-editor'

// prevent synchronized scrolls from getting into a feedback loop
// this object may hold one of two witness fields to prevent
// alternatively one component from scrolling or the other
const scrollDebounce = {}

const LOCAL_STORAGE_CODE_KEY = 'tunic-code'
const code = ref(localStorage.getItem(LOCAL_STORAGE_CODE_KEY) || [
  'Here\'s an empty glyph: `AA`',
  'Here\'s a two glyphs word: `V4Qc`',
  'You can edit glyphs by clicking on their visualization.',
  'Here\'s a word you think you\'ve figured out: `xxbb`.',
  'It shows up as "foobar" because you\'ve written the definition as follows:',
  '[xxbb]: foobar',
  'Once you\'ve defined a word, you may record it faster by using the code editor\' completion feature (try typing foobar, then enter or tab)',
  'Content is saved in your browser local storage as you type.',
  '## And *lastly*,',
  '**this** is ___markdown___ :)',
  ''
].join('\n\n'))
watch(code, () => localStorage.setItem(LOCAL_STORAGE_CODE_KEY, code.value))

const currentView = ref('show-both')

const editor = ref()
const rendererContainer = ref()
const renderer = ref()

const markdownAst = computed(() => remark().parse(code.value))

const definitions = computed(() => {
  const result = {}
  visit(markdownAst.value, 'definition', node => {
    result[node.label] = node.url
  })
  return result
})

const updateCode = ast => {
  code.value = remark().stringify(ast)
}

const scrollEditor = line => {
  if (!scrollDebounce.editor) {
    if (scrollDebounce.renderer) {
      clearTimeout(scrollDebounce.renderer)
    }
    scrollDebounce.renderer = setTimeout(() => {
      scrollDebounce.renderer = null
    }, 100)
    editor.value.revealLine(line)
  }
}

const scrollRenderer = line => {
  if (!scrollDebounce.renderer) {
    if (scrollDebounce.editor) {
      clearTimeout(scrollDebounce.editor)
    }
    scrollDebounce.editor = setTimeout(() => {
      scrollDebounce.editor = null
    }, 100)
    renderer.value.scrollToLine(line)
  }
}

onMounted(() => {
  monaco.languages.registerCompletionItemProvider('markdown', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        ...word
      }
      const suggestions = []
      for (const glyph of Object.keys(definitions.value)) {
        suggestions.push({
          label: definitions.value[glyph],
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '`' + glyph + '`',
          range
        })
      }
      return { suggestions }
    }
  })

  let ticking = false
  rendererContainer.value.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        scrollEditor(
          renderer.value.queryFirstLineVisibleIn(
            rendererContainer.value.getBoundingClientRect()
          )
        )
        ticking = false
      })
      ticking = true
    }
  })
})
</script>

<style>
@import '~purecss/build/pure-min.css';
@import '~purecss/build/grids-responsive-min.css';

* {
  box-sizing: border-box;
}

</style>

<style scoped>

.pure-menu-list {
  float: right;
}

.editor-wrapper {
  width: 100%;
  height: 100%;
}

.main {
  position: fixed;
  top: 2.5em;
  bottom: 0;
  left: 0;
  right: 0;
}

.main > div {
  height: 100%;
}

.rendered {
  overflow: auto;
}

.input, .rendered {
  display: none;
}

.show-input .input, .show-both .input,
.show-rendered .rendered, .show-both .rendered {
  display: unset;
}

</style>
