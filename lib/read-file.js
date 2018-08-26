'use strict'
const fs = require('fs')
const path = require('path')
const awk = require('awk')
const {
  readInterval
} = require('./awk-scripts')

function readFileInInterval (begin, end, pathFile) {
  const readFilePath = path.join(__dirname, '/awk-scripts/read-file.awk')
  const fileTest = path.join(__dirname, '../test/example.txt')
  const awkscript = readInterval(begin, end)
  const data = fs.readFileSync(fileTest)
  const result = awk(awkscript, data)

  return result.stdout
}
module.exports = readFileInInterval
