'use strict'
const { createDate } = require('../utils/time')
const { tree } = require('kigi')

class Directory {
  constructor ({ createAt, updateAt, size, path, name }) {
    this.path = path
    this.fullname = name
    this.isFile = false
    this.createAt = createDate(createAt)
    this.updateAt = createDate(updateAt)
    this.size = size / 1024 // Size in MG
    this.createContent()
  }
  async createContent () {
    this.content = await tree(this.path, {level: 4})
  }
}

module.exports = Directory
