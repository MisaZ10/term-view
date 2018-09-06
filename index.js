#!/usr/bin/env node
'use strict'
/* eslint new-cap: "off" */
const blessed = require('blessed')
const contrib = require('blessed-contrib')
const chalk = require('chalk')
const createArgs = require('./lib/create-args')
const list = require('./lib/create-list')

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
const screen = blessed.screen()
let itemSelected
let lastKey = ''
let listElems = []
const grid = new contrib.grid({
  rows: 1,
  cols: 4,
  screen
})
const tree = grid.set(0, 0, 1, 1, contrib.tree, {
  label: 'Files List',
  keys: ['+', 'space', 'enter', 'up', 'down']
})
tree.on('select', node => {
  itemSelected = listElems[node.index]
  return renderBox(itemSelected)
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

function renderBox (item) {
  grid.set(0, 1, 1, 3, blessed.box, {
    content: item.content,
    top: 'center',
    left: 'center',
    width: '5%',
    height: '5%',
    border: {
      type: 'line'
    },
    style: {
      focus: {
        border: {
          fg: '#f0f0f0'
        }
      }
    }
  })
  screen.render()
}

function renderTree (list) {
  const treeData = {}
  list.forEach((elem, index) => {
    const type = elem.isFile ? 'File' : 'Directory'
    const title = ` ${type}:  ${elem.fullname}`

    treeData[title] = {
      isFile: elem.isFile,
      index
    }
  })
  renderBox(JSON.stringify(treeData))
  tree.setData({
    extended: true,
    children: treeData
  })

  screen.render()
}
async function init () {
  const args = createArgs()
  listElems = await list(args)
  renderTree(listElems)
  tree.focus()
  screen.render()
}
screen.key('right', async () => {
  if (itemSelected && itemSelected.isFile) {
    await itemSelected.nextLines()
    renderBox(itemSelected)
  }
})
screen.key('left', async () => {
  if (itemSelected && itemSelected.isFile) {
    await itemSelected.previusLines()
    renderBox(itemSelected)
  }
})
init()
