'use strict'
const fs = require('fs');
const awk = require('awk')
const path = require('path')
const { readFileInInterval } = require('../read-file')
const { createDate } = require('../utils/time')
const { countLines } = require('../utils/awk-scripts')
const readLimit = 50

class File {
  constructor (pathFile) {
    const { birthtime, mtime, size } = fs.statSync(pathFile);
    const { dir, ext, name } = path.parse(pathFile)
    const data = fs.readFileSync(pathFile)
    this.createAt = createDate(birthtime)
    this.updateAt = createDate(mtime)
    this.size = size / 1024 //Size in MG
    this.path = pathFile
    this.dir = dir
    this.name = name
    this.ext = ext
    this.fullname = name + ext
    this.isFile = true
    this._isImg = /\.(jpe?g|png|gif|bmp)$/i.test(ext)
    if(!this._isImg) {
      this._begin = 0
      this._end = readLimit;
      const result = awk(countLines, data)
      console.log('result', result)
      // this._limit = stdout
    }
  }
  nextLines () {
    const end = this._end
    this._end += readLimit
    if(this._end > this._limit){
      this._end = this._limit
    }
    return readFileInInterval(this._begin, end, this.path)
  }

  previusLines() {
    const begin = this._begin
    this._begin -= this._limit
    if(this._begin < 0 ) {
      this._begin = 0
    }
    return readFileInInterval(this._begin, end, this.path)
  }
}

module.exports = File
