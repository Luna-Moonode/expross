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
 * 加装一个method为get的layer
 * @param fn
 * @returns {Route}
 */
Route.prototype.get = function(fn) {
    let layer = new Layer('/', fn);
    layer.method = 'get';
    this.methods['get'] = true;
    this.stack.push(layer);
    return this;
};

/**
 * 根据route中的stack中的layer中的method分发路由
 * @param req
 * @param res
 */
Route.prototype.dispatch = function(req, res) {
    let self = this;
         let method = req.method.toLowerCase();
    for (let i = 0; i < self.stack.length; i++) {
        if (method === self.stack[i].method) {
            return self.stack[i].handle_request(req, res);
        }
    }
};

module.exports = Route;