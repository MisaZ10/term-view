const args = require('args')
const path = require('path')
args
	.option('path', 'The path to work (current path by default)')
	.option('img', 'Enable/disable show images', false)

const argv = args.parse(process.argv)

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
argv.path = createPath(argv.path)

module.exports = argv;