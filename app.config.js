import path from 'path';


var root = path.resolve('');

export default {
    root: root,
    client: path.resolve(root, 'app'),
    deploy: path.resolve(root, 'deploy'),
    stats: path.resolve(root, 'deploy/stats/react-loadable.json'),
    publicPath: '/test/',
    port: 9000,
    mockPort: 5000,
};