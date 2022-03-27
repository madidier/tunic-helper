const { defineConfig } = require('@vue/cli-service')
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new MonacoEditorPlugin({
        // https://github.com/microsoft/monaco-editor/tree/main/webpack-plugin#options
        languages: ['markdown']
      })
    ]
  }
})
