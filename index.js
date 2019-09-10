#!/usr/bin/env node

'use strict'
/* eslint new-cap: "off" */
const blessed = require('blessed')
const contrib = require('blessed-contrib')
const chalk = require('chalk')
const createArgs = require('./lib/create-args')
const createList = require('./lib/create-list')

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message} \n${err.stack}`)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

const screen = blessed.screen()
let lastKey = ''

const lists = []
let listSelected = -1

const grid = new contrib.grid({
  rows: 1,
  cols: 4,
  screen
})

const box = grid.set(0, 1, 1, 3, blessed.box, {
  content: ' *** Loading ***',
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

const tree = grid.set(0, 0, 1, 1, contrib.tree, {
  label: 'Files List',
  keys: ['+', 'space', 'enter', 'up', 'down']
})

tree.on('select', node => {
  const { listElems } = lists[listSelected]
  lists[listSelected].itemSelected = listElems[node.index]
  return renderBox()
})

function addList (listElems) {
  const treeData = {}
  listElems.forEach((elem, index) => {
    const type = elem.isFile ? 'File' : 'Directory'
    const title = ` ${type}:  ${elem.fullname}`

    treeData[title] = {
      isFile: elem.isFile,
      index
    }
  })
  lists.push({
    itemSelected: listElems[0],
    treeData,
    listElems
  })
  listSelected++
  renderTree()
}

function renderBox () {
  const { itemSelected } = lists[listSelected]
  box.setContent(itemSelected.content)
  screen.render()
}

function renderTree () {
  const { treeData } = lists[listSelected]

  renderBox()

  tree.setData({
    extended: true,
    children: treeData
  })

  screen.render()
}

async function init () {
  const args = createArgs()
  const listElems = await createList(args)
  addList(listElems)
  tree.focus()
  screen.render()
}

screen.key('right', async () => {
  const { itemSelected } = lists[listSelected]

  if (itemSelected && itemSelected.isFile) {
    await itemSelected.nextLines()
    renderBox()
  }
})

screen.key('left', async () => {
  const { itemSelected } = lists[listSelected]

  if (itemSelected && itemSelected.isFile) {
    await itemSelected.previusLines()
    renderBox()
  }
})

screen.key('enter', async () => {
  const { itemSelected } = lists[listSelected]

  if (itemSelected && !itemSelected.isFile) {
    if (!itemSelected.contentList) await itemSelected.createContentList()
    addList(itemSelected.contentList)
  }
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

screen.key('backspace', (ch, key) => {
  if (lists.length > 1) {
    lists.pop()
    listSelected--
    renderTree()
  }
})

init()
  .catch(handleFatalError)
