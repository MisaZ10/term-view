'use strict'
const moment = require('moment')

function getOffset () {
  return (new Date().getTimezoneOffset() / 60) * -1
}
function createDate (time) {
  const d = new Date(time)
  return moment(d.getTime() + getOffset()).format('MMMM Do YYYY, h:mm:ss a')
}

module.exports = {
  createDate,
  getOffset
}
