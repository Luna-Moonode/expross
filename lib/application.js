const http = require('http');
const Router = require('./router');

// 最后成为app
module.exports = {
    _router: new Router(),
    get: function(path, fn) {
        return this._router.get(path, fn);
    },
    listen: function(port, cb) {
        let self = this;
        let server = http.createServer((req, res) => {
            if (!res.send) {
                // 封装res.send()方法
                res.send = (body) => {
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end(body);
                }
            }
            // 执行路由中间件
            return self._router.handle(req, res);
        });
        return server.listen.apply(server, arguments);
    }
};
