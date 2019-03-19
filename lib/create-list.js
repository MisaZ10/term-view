'use strict'
const { File, Directory } = require('./models')
const { treeJson } = require('kigi')

async function listDirectory (args) {
  const root = args.path
  const tree = await treeJson(root, {level: args.level})
  return tree.children.map((elem) => {
    if (elem.type === 'file') {
      return new File(elem)
    }
    elem.level = args.level
    return new Directory(elem)
  })
}

module.exports = listDirectory
