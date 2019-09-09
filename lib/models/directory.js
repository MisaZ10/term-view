'use strict'
const { createDate } = require('../utils/time')
const { tree, treeJson } = require('kigi')
const File = require('./file')


class Directory {
  constructor({ createAt, updateAt, size, path, name, level }) {
    this.path = path
    this.fullname = name
    this.isFile = false
    this.createAt = createDate(createAt)
    this.updateAt = createDate(updateAt)
    this.size = size / 1024 // Size in MG
    this.contentList = false
    this.content = false
    this.level = level
  }

  static async createDirectory(data) {
    const dir = new this(data)
    await dir.createContent()
    await dir.createContent()
    return dir
  }

  async createContent() {
    this.content = await tree(this.path, { level: this.level })
  }

  async createContentList() {
    const json = await treeJson(this.path, { level: this.level })
    const promises = json.children.map((elem) => {
      if (elem.type === 'file') {
        return File.createFile(elem)
      }
      elem.level = this.level
      return Directory.createDirectory(elem)
    })
    this.contentList = await Promise.all(promises)
  }
}

module.exports = Directory
