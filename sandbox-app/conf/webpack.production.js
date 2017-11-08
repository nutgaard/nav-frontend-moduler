const path = require('path');
const WebpackProductionConfig = require('./_webpack.global');

const babelRule = WebpackProductionConfig.module.rules.find((rule) => (rule.loader === 'babel-loader'));

if (babelRule) {
    if (babelRule.include) {
        babelRule.include.push(/_([a-z]|[A-Z])+\.example\.js/);
        babelRule.include.push(/_([a-z]|[A-Z])+\.sample\.js/);
    } else {
        babelRule.include = [/_([a-z]|[A-Z])+\.sample\.js/];
        babelRule.include.push(/_([a-z]|[A-Z])+\.example\.js/);
    }
}

WebpackProductionConfig.output = {
    path: path.join(__dirname, '../', 'dist'),
    publicPath: './',
    filename: '[name].js',
    chunkFilename: '[name].js'
};

module.exports = WebpackProductionConfig;
