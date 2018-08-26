'use strict'
const fs = require('fs')
const path = require('path')
const { File, Directory } = require('./models')

function join (root, ph) {
  return path.join(root, ph)
}
function listDirectory (args) {
  const root = args.path
  return new Promise((resolve, reject) => {
    fs.readdir(root, (err, items) => {
      if (err) return reject(err)
      const list = items.map((elem) => {
        const joinPath = join(root, elem)
        if (fs.lstatSync(joinPath).isDirectory()) {
          return new Directory({
						pathDirectory: joinPath,
						name: elem
					})
        }
        return new File(joinPath)
      })
      resolve(list)
    })
  })
}

module.exports = listDirectory
