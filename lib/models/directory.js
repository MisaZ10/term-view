'use strict'

class Directory {
  constructor ({ pathDirectory, name }) {
    this.path = pathDirectory
    this.fullname = name
    this.isFile = false
  }
}

module.exports = Directory
