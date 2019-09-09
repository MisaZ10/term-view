'use strict'
const { File, Directory } = require('./models')
const { treeJson } = require('kigi')

async function listDirectory (args) {
  const root = args.path
  const tree = await treeJson(root, {level: args.level})
  const promises =  tree.children.map((elem) => {
    if (elem.type === 'file') {
      return File.createFile(elem)
    }
    elem.level = args.level
    return Directory.createDirectory(elem)
  })
  return Promise.all(promises)
}

module.exports = listDirectory
