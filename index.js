const path = require('path')
const MemoryFS = require('memory-fs')
const webpack = require('webpack')

const getWebpackConfig = (config) => {
  const { configPath, ...preprocessorConfig } = config
  const webpackFileConfig = configPath ? require(path.resolve(configPath)) : undefined
  return { ...webpackFileConfig, ...preprocessorConfig }
}

// https://webpack.js.org/api/node/#compiling-to-memory
const compileWebpack = (config, file, done) => {
  const parsedPath = path.parse(file)

  config = {
    ...config,
    entry: file,
    output: {
      ...config.output,
      filename: parsedPath.base,
      path: parsedPath.dir,
    },
  }

  const fs = new MemoryFS()
  const compiler = webpack(config)

  compiler.outputFileSystem = fs
  compiler.run((err) => {
    if (err) done(err)
    const contentBuffer = fs.readFileSync(file)
    done(null, contentBuffer)
  })
}

const createWebpackPreprocessor = (args, config, logger) => {
  const log = logger.create('preprocessor.webpack')

  return (content, file, done) => {
    log.debug('Processing "%s".', file.path)
    const webpackConfig = getWebpackConfig(config)
    compileWebpack(
      webpackConfig,
      file.path,
      (err, result) => done(null, result)
    )
  }

}

createWebpackPreprocessor.$inject = [
  'args',
  'config.webpackPreprocessor',
  'logger'
]

module.exports = {
  'preprocessor:webpack': ['factory', createWebpackPreprocessor]
}
