const http = require('http');
const Layer = require('./Layer');

/**
 * Route类
 * @param path
 * @constructor
 */
let Route = function(path) {
    this.path = path;
    this.stack = [];
    this.methods = {};
};

/**
 * 判断route中的methods对象中是否存在相应的请求方法
 * @param method
 * @returns {boolean}
 * @private
 */
Route.prototype._handles_method = function(method) {
    let name = method.toLowerCase();
    return Boolean(this.methods[name]);
};

/**
 * 为route加装各种方法的layer
 * @return Route
 */
http.METHODS.forEach(method => {
    method = method.toLowerCase();
    Route.prototype[method] = function(fn) {
        let layer = new Layer('/', fn);
        this.methods[method] = true;
        layer.method = method;
        this.stack.push(layer);
        return this;
    }
});

/**
 * 根据route中的stack中的layer中的method分发路由
 * @param req
 * @param res
 * @param done
 */
Route.prototype.dispatch = function(req, res, done) {
    let self = this,
        method = req.method.toLowerCase(),
        stack = self.stack,
        idx = 0;

    function next(err) {
        /**
         * 这里的done是上层的next函数，意义是跳过这个route，停止遍历route.stack
         */
        // 如果err是route，跳过本层route，执行done()
        if (err === 'route') return done();
        // 如果err是router，跳过本层route，执行done(err)
        if (err === 'router') return done(err);
        // 如果stack遍历结束还没有匹配成功，结束route，执行done();
        if (idx >= stack.length) return done(err);
        const layer = stack[idx++];
        // 如果请求方法匹配失败，执行next函数，继续遍历
        if (method !== layer.method) return next(err);
        if (err) {
            layer.handle_error(err, req, res, next);
        } else {
            layer.handle_request(req, res, next);
        }
    }
    next();
};

module.exports = Route;