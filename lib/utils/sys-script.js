'use strict'

const exec = require('child_process').exec

function countLines (fullPath) {
  return new Promise((resolve, reject) => {
    exec(`wc '${fullPath}' -l`,
      function (error, stdout, stderr) {
        if (error !== null) {
          return reject(new Error('error to count lines ' + stderr))
        }
        if (!stdout || stdout.length === 0) {
          return reject(new Error('invalid result countLines stdout: ' + stdout))
        }
        const count = parseInt(stdout.split(' ')[0])
        return resolve(count)
      })
  })
}

function readInterval (begin, end, fullPath) {
  begin = parseInt(begin)
  end = parseInt(end)
  if (Number.isNaN(begin) || Number.isNaN(end)) {
    throw new Error('invalid number')
  }
  if (begin < 0) {
    begin = 0
  }
  // SED start in 1
  begin++
  end++
  return new Promise((resolve, reject) => {
    exec(`sed '${begin},${end}!d' '${fullPath}'`,
      function (error, stdout, stderr) {
        if (error !== null) {
          return reject(new Error('error to count lines ' + stderr))
        }
        if (!stdout) {
          return reject(new Error(`invalid result readInterval stdout: ${stdout}, stderr: ${stderr} <${begin},${end}> `))
        }
        return resolve(stdout)
      })
  })
}

module.exports = {
  countLines,
  readInterval
}
