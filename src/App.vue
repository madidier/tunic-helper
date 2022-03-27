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
        <MonacoEditor :value="code" @change="value => code = value" />
      </div>
    </div>
    <div class="rendered pure-u-1" :class="{ 'pure-u-lg-1-2': currentView === 'show-both' }">
      <TunicRenderer :node="markdownAst" :definitions="definitions" @change="ast => updateCode(ast)" />
    </div>
  </div>
</template>

<script>
import MonacoEditor from './components/MonacoEditor.vue'
import TunicRenderer from './components/TunicRenderer.vue'
import { remark } from 'remark'
import { visit } from 'unist-util-visit'
import * as monaco from 'monaco-editor'

const LOCAL_STORAGE_CODE_KEY = 'tunic-code'

export default {
  name: 'App',
  components: {
    MonacoEditor,
    TunicRenderer
  },

  data () {
    const code = localStorage.getItem(LOCAL_STORAGE_CODE_KEY) || [
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
    ].join('\n\n')
    return {
      code,
      currentView: 'show-both'
    }
  },

  computed: {
    markdownAst () {
      return remark().parse(this.code)
    },

    definitions () {
      const result = {}
      visit(this.markdownAst, 'definition', node => {
        result[node.label] = node.url
      })
      return result
    }
  },

  methods: {
    updateCode (ast) {
      this.code = remark().stringify(ast)
    }
  },

  watch: {
    code () {
      localStorage.setItem(LOCAL_STORAGE_CODE_KEY, this.code)
    }
  },

  mounted () {
    monaco.languages.registerCompletionItemProvider('markdown', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          ...word
        }
        const suggestions = []
        for (const glyph of Object.keys(this.definitions)) {
          suggestions.push({
            label: this.definitions[glyph],
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: '`' + glyph + '`',
            range
          })
        }
        return { suggestions }
      }
    })
  }
}
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
