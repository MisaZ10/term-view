'use strict'
const terminalImage = require('terminal-image')
const { createDate } = require('../utils/time')
const { countLines, readInterval } = require('../utils/sys-script')
const readLimit = 25

class File {
  constructor ({ createAt, updateAt, size, path, extension, name }) {
    this.createAt = createDate(createAt)
    this.updateAt = createDate(updateAt)
    this.size = size / 1024 // Size in MG
    this.path = path
    this.name = name
    this.ext = extension
    this.fullname = name
    this.isFile = true
    this._page = 0
    this._isImg = /\.(jpe?g|png|gif|bmp)$/i.test(extension)
  }

  static async createFile (data) {
    const file = new this(data)
    if (!file._isImg) {
      await file.fileTextData()
    } else {
      await file.imgData()
    }
    return file
  }

  async fileTextData () {
    this._begin = 0
    this._limit = await countLines(this.path)
    this._pages = Math.ceil(this._limit / readLimit)
    await this.nextLines()
  }

  async imgData () {
    this.content = await terminalImage.file(this.path)
  }

  async nextLines () {
    if (this._isImg || this._page === this._pages) return
    const _begin = this._page * readLimit
    const _end = _begin + readLimit
    if (this._page + 1 < this._pages) this._page++
    this.content = await readInterval(_begin, _end, this.path)
  }

  async previusLines () {
    if (this._isImg || this._page === 0) return
    this._page--
    const _begin = this._page * readLimit
    const _end = _begin + readLimit
    this.content = await readInterval(_begin, _end, this.path)
  }
}

module.exports = File
