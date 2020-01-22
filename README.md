# expross框架  V1.2
github地址：https://github.com/WangZhechao/expross
***
### expross
expross 是一个工厂类, 负责创建 application 对象。
### application 
代表一个应用程序app  
```
module.exports = {
    _router: new Router(),
    get: (path, fn) => this._router.get(path, fn),
    listen: (port, cb) => Server
}
```
##### 属性:  
###### _router是Router的实例  
##### 方法:
###### `get(path, fn) => Router` 执行_router.get方法
###### `listen(port, cb, ...) => Server` 启动服务器并监听，执行_router.handle方法
### Router
##### 说明: 
###### Router代表路由组件，负责应用程序的整个路由系统。    
###### Router内部的Layer，主要包含 path、route、handle 属性。    
###### 如果一个请求来临，会先从头至尾的扫描router内部的每一层，
###### 而处理每层的时候会先对比URI，相同则扫描route的每一项，匹配成功则返回具体的信息。如果所有路由全部扫描完毕，没有任何匹配则返回未找到。
##### 属性:
###### `stack` 用于存放Router层的layer
##### 方法:
###### `route(path) => Route` 设置一个route和一个layer，layer的handle中执行route的dispatch方法，为layer增加属性route，将该layer push到Router的stack中
###### `get(path, fn) => Router` 设置一个route，执行route.get(fn)
###### `handle(req, res)` Router层的核心，如果url匹配, layer中route属性存在, 方法匹配成功，终结函数，执行该layer的handle_request方法
### Route
##### 说明：
###### 组件内部由一个 Layer 数组构成  
###### Route内部的Layer，主要包含method、handle属性。
###### 每个 Layer 对象代表一组路径相同的路由信息  
###### 具体信息存储在Route内部每个Route内部也是一个Layer数组  
##### 属性：
###### `path: String` 该Route的路径
###### `stack: Array` 用于存放该Route的layer
###### `methods: Object` 表示该Route支持的方法
###### 方法：
###### `_handles_method(method) => Boolean` 检查Router的methods对象中有无method方法，如果有，返回true  
###### `dispatch(req, res) => Void` 遍历stack，检查req.method与layer中的method属性是否匹配，如果匹配，执行该layer的handle_request方法，终结函数  
###### `get(fn) => Route` 设置一个layer，增加属性method为get，将该layer push到stack中，设置该route中methods的get为true
### Layer
##### 说明：
###### 作为Router和Route类中stack的元素，包含了路由的处理函数
###### 但是Route内部的Layer和Router内部的Layer存在一定的差异性。 
##### 属性：
###### `name: String` 该layer的名称，即handle的函数名，可为匿名
###### `path: String` 该layer的路径
###### `handle: Function` 该layer的handle函数，参数为req, res
##### 方法：
`handle_request(req, res) => Void`
###### 如果该layer存在handle函数，则执行
`match(path) => Boolean`
###### 进行路径匹配，匹配成功返回true
