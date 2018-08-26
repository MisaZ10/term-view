'use strict'
const { readFileInInterval } = require('../read-file')
const readLimit = 50
const path = require('path')

class File {
	constructor(pathFile) {
		super()
		const { dir, ext, name } = path.parse(pathFile)
		this.path = pathFile
		this.dir = dir
		this.name = name
		this.ext = ext
	}
	readLines(begin, end) {
		return readFileInInterval(begin, end, this.path)
	}
}

module.exports = File