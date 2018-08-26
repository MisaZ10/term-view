'use strict'

function readInterval(begin, end) {
  begin = parseInt(begin)
  end = parseInt(end)
  if (Number.isNaN(begin) || Number.isNaN(end)) {
    throw new Error('invalid number')
  }
  if(begin < 0 ) {
    begin = 0
  }
  return `NR < ${begin} { next } { print } NR == ${end} { exit }`
}

module.exports = {
  readInterval
}