'use strict'
const fs = require('fs')
const { createDate } = require('../utils/time')

class Directory {
  constructor ({ pathDirectory, name }) {
    const { birthtime, mtime, size } = fs.statSync(pathDirectory)
    this.path = pathDirectory
    this.fullname = name
    this.isFile = false
    this.createAt = createDate(birthtime)
    this.updateAt = createDate(mtime)
    this.size = size / 1024 // Size in MG
  }
}

module.exports = Directory
