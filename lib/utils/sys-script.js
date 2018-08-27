'use strict'

const exec = require('child_process').exec;

function countLines(fullPath) {
   return new Promise((res, rej) => {
      exec(`wc ${fullPath} -l`,
         function (error, stdout, stderr) {
            if (error !== null) {
               rej(new Error('error to count lines ' + stderr))
            }
            if (!stdout || stdout.length === 0) {
               rej(new Error('invalid result countLines stdout: ' + stdout))
            }
            const count = parseInt(stdout.split(' ')[0])
            return res(count)
         })
   })
}
function readInterval(begin, end, fullPath) {
   begin = parseInt(begin)
   end = parseInt(end)
   if (Number.isNaN(begin) || Number.isNaN(end)) {
      throw new Error('invalid number')
   }
   if (begin < 0) {
      begin = 0
   }
   // SED start in 1
   begin++;
   end++;
   return new Promise((res, rej) => {
      exec(`sed '${begin},${end}!d' ${fullPath}`,
         function (error, stdout, stderr) {
            if (error !== null) {
               rej(new Error('error to count lines ' + stderr))
            }
            if (!stdout) {
               rej(new Error('invalid result readInterval stdout: ' + stdout))
            }
            return res(stdout)
         })
   })
}
module.exports = {
   countLines,
   readInterval
}
