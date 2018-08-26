'use strict'
const fs = require('fs')
const path = require('path')
const { File, Directory } = require('./models')

function join(root, ph) {
	return path.join(root, ph)
}
function listDirectory(args) {
	const root = args.path
	return new Promise((res, rej) => {
		fs.readdir(root, (err, items) => {
			if (err) return rej(err)
			const list = items.map((elem) => {
				const joinPath = join(root, elem)
				if (fs.lstatSync(joinPath).isDirectory()) {
					return Directory(joinPath)
				}
				return File(joinPath)
			})
			res(list)
		})
	})
}

module.exports = listDirectory