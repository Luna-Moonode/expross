const http= require('http');
const Layer = require('./Layer');
const Route = require('./Route');
const url = require('url');

/*
  application => router匹配路径 ==(router.layer.handle)=> route匹配请求方法 ==(route.layer.handle)=> handle
  application => router核心（路由、中间件（包括路由中间件））
*/

/**
 * 看起来是proto，实际上实例化出来的是router，router的原型是proto
 * Router中间件
 * Router类的stack由一个一个Layer类的实例构成，Layer负责根据path分发路由
 * @constructor
 */
let router_proto = function() {
    function router(req, res, next) {
        // 从route_proto中继承handle方法
        router.handle(req, res, next);
    }
    Object.setPrototypeOf(router, router_proto);
    router.stack = [];
    return router;
};

/**
 * Router中间件根据path进行路由分发
 * 匹配成功后执行router的layer的handle_request方法(执行route.dispatch(req, res))
 * 转交给route中的layer进行再一次分发
 * @param req
 * @param res
 * @param done
 * @returns {handle|*|void}
 */
router_proto.handle = function(req, res, done) {
    let self = this,
        // 这里this指代的是router
        method = req.method,
        stack = self.stack,
        idx = 0;

    /**
     * next函数的意义是继续对router.stack的遍历
     * next函数会传递到router的layer中
     * next()函数的几个作用：
     * 1. 执行下一个处理函数，执行next()
     * 2. 报告异常，执行next(err)
     * 3. 跳过当前Route，执行Router的下一项，执行next('route')
     * 4. 跳过整个Router，执行next('router')
     * @param err
     * @returns {*}
     */
    function next(err) {
        const layerError = (err === 'route' ? null : err);
        // 如果err是router，跳过这个router，执行done
        if (layerError === 'router') return done(null);
        // 如果stack遍历结束还没有匹配成功，执行done
        if (idx >= stack.length) return done(layerError);
        const layer = stack[idx++];
        req._url = url.parse(req.url).pathname;
        if (layer.match(req._url)) {
            if (!layer.route) {
                // 如果layer没有route属性，执行中间件
                if (layerError) {
                    // 如果发生错误，执行错误处理函数
                    layer.handle_error(layerError, req, res, next);
                } else {
                    // 如果没有发生错误，执行正常函数
                    layer.handle_request(req, res, next);
                }
            } else if (layer.route._handles_method(method)) {
                // 如果layer有route属性，执行路由
                // 如果匹配成功，不再执行next函数，终止递归，执行该层layer的handle_request方法，即route的dispatch
                layer.handle_request(req, res, next);
            }
        }  else {
            // 如果匹配失败，执行next函数，继续匹配
            next(layerError);
        }
    }
    next();
};

/**
 * 创建layer，并为其增加route
 * @param path
 * @returns {Route}
 */
router_proto.route = function route(path) {
    let route = new Route(path);
    //let layer = new Layer(path, (req, res, next) => {
    //     route.dispatch(req, res, next)
    // })
    let layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    this.stack.push(layer);
    return route;
};

router_proto.use = function(fn) {
    let path = '/';
    if (typeof fn !== 'function') {
        path = fn;
        fn = arguments[1];
    }
    let layer = new Layer(path, fn);
    layer.route = undefined;
    this.stack.push(layer);
    return this;
};

/**
 * 为Router类添加http的各种请求方法
 */
http.METHODS.forEach((method) => {
    method = method.toLowerCase();
    router_proto[method] = function(path, fn) {
        let route = this.route(path);
        route[method].call(route, fn);
        return this;
    }
});

module.exports = router_proto;