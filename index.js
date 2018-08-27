#!/usr/bin/env node
'use strict'
/* eslint new-cap: "off" */
const blessed = require('blessed')
const contrib = require('blessed-contrib')
const chalk = require('chalk')
const createArgs = require('./lib/create-args')
const list = require('./lib/create-list')
const terminalImage = require('terminal-image');
const got = require('got');
const pngStringify = require('console-png');
const fs = require('fs');

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  process.exit(1)
}
process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
const screen = blessed.screen()
let lastKey = ''
let listElems = []
const grid = new contrib.grid({
  rows: 1,
  cols: 4,
  screen
})
const tree = grid.set(0, 0, 1, 1, contrib.tree, {
  label: 'Files List'
})
tree.on('select', node => {
  const elem = listElems[node.index]
  if (elem.isFile && elem._isImg) {
    return renderImg(elem.path)
  }
  if (elem.isFile) {
    return renderBox(elem.text)
  }
  renderBox('No es un archivo')
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

function renderBox (text) {
  grid.set(0, 1, 1, 3, blessed.box, {
    content: text,
    top: 'center',
    left: 'center',
    tags: true,
    border: {
      type: 'line'
    },
  })
  screen.render()
}
async function renderImg(fullPath) {
  // console.log('renderImg', fullPath);
  // const { body } = await got(fullPath, { encoding: null });
  // const content = await terminalImage.buffer(body)
  // console.log('content', content);
  const image = fs.readFileSync(fullPath)

  pngStringify(image, function (err, content) {
    if (err) throw err;
    grid.set(0, 1, 1, 3, blessed.box, {
      content,
      top: 'center',
      left: 'center',
      tags: true,
      border: {
        type: 'line'
      },
    })
  })

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

init()
