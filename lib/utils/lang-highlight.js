'use strict'
const highlight = require('cli-highlight').highlight
const ignoreIllegals = true
const langByExt = {
    js: 'javascript',
    sql: 'sql',
    md: 'markdown',
    py: 'python',
    sh: 'bash'
}

function parseContent(text, language) {
    return highlight(text, { language, ignoreIllegals })
}
module.exports = {
    langByExt,
    parseContent
}