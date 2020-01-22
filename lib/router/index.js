const Layer = require('./Layer');
const Route = require('./Route');

/**
 * application => router匹配路径 ==(router.layer.handle)=> route匹配请求方法 ==(route.layer.handle)=> handle
 *
 */

/**
 * Router中间件
 * Router类的stack由一个一个Layer类的实例构成，Layer负责根据path分发路由
 * @constructor
 */
let Router = function() {
    this.stack = [
        new Layer('*', (req, res) => {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('404');
        })
    ]
};

/**
 * Router中间件进行路由分发
 * @param req
 * @param res
 * @returns {handle|*|void}
 */
Router.prototype.handle = function(req, res) {
    let self = this,
        method = req.method;
    for (let i = 0; i < self.stack.length; i++) {
        if (self.stack[i].match(req.url) && self.stack[i].route && self.stack[i].route._handles_method(method)) {
            // 如果url匹配, layer中route属性存在, 方法匹配成功，终结函数，执行该layer的handle_request方法
            return self.stack[i].handle_request(req, res);
        }
    }
    return self.stack[0].handle_request && self.stack[0].handle_request(req, res);
};

/**
 * 为layer增加route
 * @param path
 * @returns {Route}
 */
Router.prototype.route = function route(path) {
    let route = new Route(path);
    let layer = new Layer(path, (req, res) => {
        route.dispatch(req, res);
    });
    layer.route = route;
    this.stack.push(layer);
    return route;
};

/**
 * Router中间件的get方法，为router层增加get
 * @param path
 * @param fn
 */
Router.prototype.get = function(path, fn) {
    let route = this.route(path);
    route.get(fn);
    return this;
};

module.exports = Router;