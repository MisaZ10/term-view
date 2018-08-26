'use strict'
const { readFileInInterval } = require('../read-file')
const readLimit = 50
const path = require('path')

class File {
  constructor (pathFile) {
    const { dir, ext, name } = path.parse(pathFile)
    this.path = pathFile
    this.dir = dir
    this.name = name
    this.ext = ext
    this.fullname = name + ext
    this.isFile = true
    this._isImg = /\.(jpe?g|png|gif|bmp)$/i.test(ext)
  }
  readLines (begin, end) {
    return readFileInInterval(begin, end, this.path)
  }
}

module.exports = File
