
import path from 'path';

var root = path.resolve('');
var appConfig = {};

try {
    appConfig = require(root + '/app.config.js');

    if(appConfig.default) {
        appConfig = appConfig.default;
    }

} catch(err) {
    console.warn(`未在项目根目录下找到app.config.js文件，将使用默认配置目录`);
}


var defaultConfig = {
    root: root,
    client: path.resolve(root, 'app'),
    server: path.resolve(root, 'node/server'),
    deploy: path.resolve(root, 'deploy'),
    stats: path.resolve(root, 'deploy/stats/react-loadable.json'),
    public: path.resolve(root, 'node/public'),
    publicPath: '/',
    port: 3000,
};

export default Object.assign({}, defaultConfig, appConfig);