#!/usr/bin/env node
'use strict'
/* eslint new-cap: "off" */

const blessed = require('blessed')
const contrib = require('blessed-contrib')
const chalk = require('chalk')
const createArgs = require('./lib/create-args')
const list = require('./lib/create-list')
function handleFatalError(err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  process.exit(1)
}
process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
const screen = blessed.screen()
let lastKey = ''
const grid = new contrib.grid({
  rows: 1,
  cols: 4,
  screen
})
const tree = grid.set(0, 0, 1, 1, contrib.tree, {
  label: 'Files List'
})
const box = grid.set(0, 1, 1, 3, blessed.box, {
  content: 'My Box'
})
const box2 = grid.set(0, 1, 1, 3, blessed.box, {
  content: 'My asdfasdf'
})
tree.on('select', node => {
  console.log('Node ', node)
})
screen.key(['escape', 'C-c'], (ch, key) => {
  if (lastKey === 'C-c' && key.full === 'C-c') {
    process.exit(0)
  }
  if (key.full === 'escape') {
    process.exit(0)
  }
  lastKey = key.full
})

function renderTree(list) {
  const treeData = {}
  list.forEach(elem => {
    const type = elem.isFile ? 'File' : 'Directory'

    const title = ` ${type}:  ${elem.fullname}`
    treeData[title] = {
      isFile: elem.isFile
    }
  })
  tree.setData({
    extended: true,
    children: treeData
  })

  screen.render()
}
async function init() {
  const args = createArgs()
  const listFiles = await list(args)
  renderTree(listFiles)
  tree.focus()
  screen.render()
}

init()