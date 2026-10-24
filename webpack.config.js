const path = require('path')
module.exports = {
    target: 'node',
    entry: './src/index.ts',
    context: __dirname,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        libraryTarget: 'commonjs2',
    },
    resolve: { extensions: ['.ts', '.js'] },
    module: { rules: [
        { test: /\.ts$/, use: [{ loader: 'ts-loader', options: { configFile: 'tsconfig.json' } }] },
        { test: /\.pug$/, use: ['apply-loader', 'pug-loader'] },
    ] },
    externals: ['fs', /^@angular\//, /^@ng-bootstrap\//, /^tabby-/, /^rxjs/],
}
