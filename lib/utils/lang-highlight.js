'use strict'
const highlight = require('cli-highlight').highlight
const map = require('lang-map')

const ignoreIllegals = true

function getLangByExtension (ext) {
  const langs = map.extensions(ext)
  if (!langs || langs.length === 0) return null
  return langs[0]
}
function parseContent (text, language) {
  return highlight(text, { language, ignoreIllegals })
}
module.exports = {
  getLangByExtension,
  parseContent
}
