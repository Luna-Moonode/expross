/**
 * layer层，根据路由匹配
 * @param path
 * @param fn
 * @constructor
 */
function Layer(path, fn) {
    this.handle = fn;
    this.name = fn.name || '<anonymous>';
    this.path = path;
}

/**
 * layer层执行handle方法
 * @param req
 * @param res
 */
Layer.prototype.handle_request = function(req, res) {
    let fn = this.handle;
    if (fn) {
        fn(req, res);
    }
};

/**
 * layer层进行路由匹配
 * @param path
 * @return boolean
 */
Layer.prototype.match = function(path) {
    return path === this.path || this.path === '*';
};

module.exports = Layer;