const path = require('path')

module.exports = {
    entry: './dist/index.js',
    module: {
        rules: []
    },
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'index_bundle.js'
    },
    plugins: [],
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}