<template>
  <nav class="navbar is-primary">
    <div class="navbar-brand">
      <div class="navbar-item">Glyph Helper</div>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
      </div>
      <div class="navbar-end">
        <a class="navbar-item is-tab" :class="{ 'is-active': currentView === 'show-input' }" href="#" @click="showInput">
          Input
        </a>
        <a class="navbar-item is-tab" :class="{ 'is-active': currentView === 'show-rendered' }" href="#" @click="showRendered">
          Rendered
        </a>
        <a class="navbar-item is-tab is-hidden-mobile" :class="{ 'is-active': currentView === 'show-both' }" href="#" @click="showBoth">
          Both
        </a>
      </div>
    </div>
  </nav>
  <div v-show="currentView !== 'show-rendered'" class="input-pane" :class="{ 'fullwidth': currentView !== 'show-both' }">
    <div class="editor-wrapper">
      <MonacoEditor :value="code" @change="value => code = value" @scrollTopChange="line => scrollRenderer(line)" ref="editor" />
    </div>
  </div>
  <div v-show="currentView !== 'show-input'" class="rendered-pane" :class="{ 'fullwidth': currentView !== 'show-both' }" ref="rendererContainer" @scroll="onRendererScroll">
    <div class="content">
      <TunicRenderer ref="renderer"
        :node="markdownAst" :settings="settings"
        @change="applyUpdate" @settingsChange="applySettingsChange"
        />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import MonacoEditor from './components/MonacoEditor.vue'
import TunicRenderer from './components/TunicRenderer.vue'
import { remark } from 'remark'
import { visit } from 'unist-util-visit'
import find from 'unist-util-find'
import * as Composition from './tunic/composition'
import * as monaco from 'monaco-editor'

// prevent synchronized scrolls from getting into a feedback loop
// this object may hold one of two witness fields to prevent
// alternatively one component from scrolling or the other
const scrollDebounce = {}

const LOCAL_STORAGE_CODE_KEY = 'tunic-code'
const code = ref(localStorage.getItem(LOCAL_STORAGE_CODE_KEY) || [
  '# Tutorial',
  'Here\'s a one-glyph blank Tunic word: `AA`',
  'Here\'s a two-glyphs Tunic word: `V4Qc`',
  'You can edit a Tunic word or make it bigger by clicking on its visualization in the right panel. Try editing the word above.',
  'Notice that you can create blank words by repeating the A letter between backquotes inside the left panel. Try typing a three-glyph blank word here:',
  'Here\'s a Tunic word you think you\'ve figured out: `xxbb`.',
  'It shows up as "foobar" because you\'ve written its definition as follows (look on the left panel):',
  '[xxbb]: foobar',
  'Notice that the Tunic word is uniquely represented by the series of letters "xxbb"',
  'You can still edit that word by clicking on it as you would on glyphs. Try it here: `xxbb`',
  'You can also cycle through Tunic words in your manuscript by using tab or shift+tab after you\'ve clicked on the first word in a sequence on the right panel.',
  'Try it here: `Tm` `V4Qc` `iu` `DkLos/` (it\'s probably gibberish)',
  'Once you\'ve defined and memorized a Tunic word, you may type it faster by using the code editor\' completion feature (try typing "foo", then enter or tab):',
  'Content is automatically saved in your browser local storage as you type. I would still advise you to make backups.',
  '# This is a [Markdown](https://en.wikipedia.org/wiki/Markdown) subset',
  '## You can have titles',
  '### Subtitles',
  '#### Sub-subtitles and so on...',
  '- You may use...',
  '- ...lists',
  'And have stuff in *italics*, **bold**, ***or both***',
  'You may use a horizontal separator:',
  '***',
  'Once you are comfortable with the basics and want to use the more advanced features of this tool, read [this](https://gist.github.com/madidier/d39adaddc80eeb54925c1c19d09234e7).',
  'And if you ever want to see this text again, just delete all the text and refresh the page to start over.',
  ''
].join('\n\n'))
watch(code, () => localStorage.setItem(LOCAL_STORAGE_CODE_KEY, code.value))

const currentView = ref('show-both')

const editor = ref()
const rendererContainer = ref()
const renderer = ref()

const markdownAst = computed(() => remark().parse(code.value))

const settings = computed(() => {
  const settingsNode = find(markdownAst.value, { type: 'code', lang: 'settings' })
  const inputSettings = (() => {
    try {
      return settingsNode ? JSON.parse(settingsNode.value) : {}
    } catch (e) {
      // Do nothing; the parsing error will be displayed in the rendered pane
      return {}
    }
  })()
  const compiledSettings = Composition.compile(inputSettings)
  const definitions = {}
  visit(markdownAst.value, 'definition', node => {
    definitions[Composition.readWord(node.label, compiledSettings)] = node.url
  })
  return {
    showTranslations: true,
    showDefinitions: true,
    definitions,
    ...inputSettings,
    ...compiledSettings
  }
})

const applyUpdate = e => {
  editor.value.applyUpdate({ position: e.position, value: '`' + e.value + '`' })
}

const applySettingsChange = e => {
  editor.value.applyUpdate({ position: e.position, value: '```settings\n' + JSON.stringify(e.value, null, 2) + '\n```' })
}

const showInput = () => {
  currentView.value = 'show-input'
  beforeShowInput()
}

const showRendered = () => {
  currentView.value = 'show-rendered'
  beforeShowRendered()
}

const showBoth = () => {
  currentView.value = 'show-both'
  beforeShowInput()
  beforeShowRendered()
}

const beforeShowInput = () => {
  const savedLine = rendererScrollPosition()
  savedLine !== null && nextTick(() => {
    scrollEditor(savedLine)
  })
}

const beforeShowRendered = () => {
  const savedLine = editor.value.getTopLine()
  savedLine !== null && nextTick(() => {
    scrollRenderer(savedLine)
  })
}

const scrollEditor = line => {
  if (!scrollDebounce.editor) {
    if (scrollDebounce.renderer) {
      clearTimeout(scrollDebounce.renderer)
    }
    scrollDebounce.renderer = setTimeout(() => {
      scrollDebounce.renderer = null
    }, 100)
    editor.value && editor.value.revealLine(line)
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
    renderer.value && renderer.value.scrollToLine(line)
  }
}

const rendererScrollPosition = () => {
  return renderer.value && rendererContainer.value
    ? renderer.value.queryFirstLineVisibleIn(rendererContainer.value.getBoundingClientRect())
    : null
}

let ticking = false
const onRendererScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      ticking = false
      const position = rendererScrollPosition()
      position !== null && scrollEditor(position)
    })
    ticking = true
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
      for (const glyph of Object.keys(settings.value.definitions)) {
        suggestions.push({
          label: settings.value.definitions[glyph],
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '`' + glyph + '`',
          range
        })
      }
      return { suggestions }
    }
  })
})
</script>

<style lang="sass">
$primary: #0057b7
$info: #ffd700

$navbar-height: 1.5rem
$navbar-padding-vertical: .25rem
$navbar-padding-horizontal: .5rem
$navbar-tab-active-border-bottom-color: #ffd700
$navbar-breakpoint: 0

@import "~bulma/sass/utilities/_all"
@import "~bulma/sass/base/_all"
@import "~bulma/sass/elements/box"
@import "~bulma/sass/elements/button"
@import "~bulma/sass/elements/content"
@import "~bulma/sass/components/dropdown"
@import "~bulma/sass/components/message"
@import "~bulma/sass/components/navbar"
@import "~bulma/sass/form/shared"
@import "~bulma/sass/form/input-textarea"
@import "~bulma/sass/form/checkbox-radio"
@import "~bulma/sass/form/tools"
@import "~bulma/sass/helpers/visibility"

.foobar
  color: $primary-light

html
  overflow-y: auto

#app
  display: grid
  grid: "nav nav" auto "left right" 1fr / 1fr 1fr
  width: 100vw
  height: 100vh

.navbar
  grid-area: nav

.fullwidth
  grid-column: span 2

@include mobile
  #app > div
    grid-column: span 2

.content
  margin: .5rem 1rem

.editor-wrapper
  width: 100%
  height: 100%

.input-pane
  min-width: 0 // Editor won't shrink without this

.rendered-pane
  overflow-y: auto
</style>
