'use strict'
const fs = require('fs');
const path = require('path')
const { createDate } = require('../utils/time')
const { countLines, readInterval } = require('../utils/sys-script')
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
      this.fileTextData()
    }
  }
  async fileTextData() {
    this._begin = 0
    this._limit = await countLines(this.path)
    this.text = await this.nextLines()
  }
  async nextLines () {
    let end = this._begin + readLimit
    if(end > this._limit){
      end = this._limit
    }
    const text = await readInterval(this._begin, end, this.path)
    this._begin += readLimit
    return text
  }

  previusLines() {
    this._begin -= this._limit
    if(this._begin < 0 ) {
      this._begin = 0
    }
    const end = this._begin + readLimit
    return readInterval(this._begin, end, this.path)
  }
}

module.exports = File
