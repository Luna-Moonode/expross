const http = require('http');
const Router = require('./router');


function Application() {
    this._router = new Router();
}

/**
 * 开启服务器的主要代码
 * @param port
 * @param cb
 * @returns {Server}
 */
Application.prototype.listen = function(port, cb) {
    let self = this;
    const server = http.createServer((req, res) => {
        self.handle(req, res);
    });
    return server.listen.apply(server, arguments);
};

/**
 * 服务器创建之后执行
 * @param req
 * @param res
 */
Application.prototype.handle = function(req, res) {
    // 封装res.send方法
    let self = this;
    if (!res.send) {
        res.send = (body) => {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(body);
        }
    }
    // 错误处理
    /**
     * done函数的意义是在router和route中
     * @param err
     */
    const done = function finalHandler(err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        if (err) {
            res.end(`404: ${err}`);
        } else {
            res.end(`Cannot ${req.method} ${req.url}`);
        }
    };
    // 路由分发
    let router = self._router;
    router.handle(req, res, done);
};

/**
 * 为app增加各种请求方法的路由，处理函数
 */
http.METHODS.forEach((method) => {
    method = method.toLowerCase();
    Application.prototype[method] = function(path, fn) {
        this._router[method](path, fn);
        return this;
    }
});

Application.prototype.use = function(fn) {
    let path = '/',
        router = this._router;
    if (typeof fn !== 'function') {
        path = fn;
        fn = arguments[1];
    }
    router.use(path, fn);
    return this;
};

// 最后成为app
module.exports = Application;
