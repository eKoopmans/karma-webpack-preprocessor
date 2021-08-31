> Preprocessor to compile Webpack files on the fly.

## How to install?

```
npm install karma-webpack-preprocessor --save-dev
```

## Configuration

```js
// karma.conf.js
module.exports = function(config) {
  config.set({

    // ...

    files: [
      './app/**/*.spec.js',
    ],

    preprocessors: {
      ['./app/**/*.spec.js']: ['webpack'],
    },

    webpackPreprocessor: {
      // Specify the path to your webpack configuration
      configPath: './config/webpack',

      // And/or specify configuration options directly
      target: 'browserslist',
      optimization: { minimize: false },
      // ...

      // These fields will be overridden by karma-webpack-preprocessor:
      // entry, output.filename, output.path
    },

    /// ...

  })
}
```

### Custom preprocessors

You can use [custom preprocessors](http://karma-runner.github.io/6.3/config/preprocessors.html#configured-preprocessors) to create variants of the Webpack preprocessor, if you need different configurations for different files.

This example uses the standard Webpack config file to build our library, then uses a custom config to build our tests:

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    files: [
      './app/index.js',
      './app/**/*.spec.js',
    ],

    preprocessors: {
      './app/index.js': ['webpack'],
      './app/**/*.spec.js': ['webpackTests'],
    },

    webpackPreprocessor: {
      configPath: './webpack.config.js',
    },

    customPreprocessors: {
			// Clones the 'webpack' preprocessor, overwriting any specified options
      webpackTests: {
        base: 'webpack',
        options: {
          configPath: '',
          externals: ['myLibrary'],
          externalsType: 'global',
        },
      },
    },
  })
}
```
