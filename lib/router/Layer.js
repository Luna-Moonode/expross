/**
 * layer层，根据路由匹配
 * @param path
 * @param fn
 * @constructor
 */
function Layer(path, fn) {
    this.handle = fn;
    this.name = fn.name || '<anonymous>';
    this.path = undefined;
    this.fast_star = (path === '*');
    if (!this.fast_star) {
        this.path = path;
    }
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

/**
 * layer的错误处理函数，人工填写
 * 区分错误处理函数与普通函数的方式是判断参数的个数
 * @param error
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
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
    if (this.fast_star) {
        // 如果路径是*
        this.path = '';
        return true;
    }
    if (this.route && this.path === path.slice(-this.path.length)) {
        // 普通路由，从尾部切
        return true;
    }
    if (!this.route) {
        // 根据是否具有this.route区分普通路由和中间件
        if (this.path === '/') {
            // 不带路径的中间件
            this.path = '';
            return true;
        } else if (this.path === path.slice(0, this.path.length)) {
            // 带路径的中间件，从头部切
            return true;
        } else if (this.path === path.slice(-this.path.length)) {
            // 相对路径路由，从尾部切
            return true;
        }
    }
    return false;
};

module.exports = Layer;