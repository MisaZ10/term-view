const args = require('args')
const path = require('path')
const fs = require('fs')

args
	.option('path', 'The path to work (current path by default)')
	.option('img', 'Enable/disable show images', false)


const localPath = process.cwd()
function createPath(pathDirectory) {
	if (process.argv.length === 3) {
		pathDirectory = process.argv[2]
	}
	if (!pathDirectory) {
		return localPath
	}
	if (path.isAbsolute(pathDirectory)) {
		return pathDirectory
	}
	return path.join(localPath, pathDirectory)
}

function checkIsDirectory(pathDirectory) {
	return fs.lstatSync(pathDirectory).isDirectory()
}

function createArgs() {
	const argv = args.parse(process.argv)
	argv.path = createPath(argv.path)
	if(!checkIsDirectory(argv.path)) {
		throw new Error(`${argv.path} is not a directory`)
	}
	return argv
}
module.exports = createArgs;