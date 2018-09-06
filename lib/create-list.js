'use strict'
const { File, Directory } = require('./models')
const { treeJson } = require('kigi')

async function listDirectory (args) {
  const root = args.path
  const tree = await treeJson(root, {level: 2})
  return tree.children.map((elem) => {
    if (elem.type === 'file') {
      return new File(elem)
    }
    return new Directory(elem)
  })
}

module.exports = listDirectory
