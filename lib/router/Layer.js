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
 * @param next
 */
Layer.prototype.handle_request = function(req, res, next) {
    let fn = this.handle;
    if (fn) {
        try {
            fn(req, res, next);
        } catch (err) {
            // 如果执行fn时出错，则执行next函数，继续遍历，参数为err
            next(err);
        }
    }
};

Layer.prototype.handle_error = function(error, req, res, next) {
    let fn = this.handle;
    if (fn) {
        if (fn.length !== 4) {
            return next(error);
        }
        try {
            fn(error, req, res, next);
        } catch (err) {
            next(err);
        }
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