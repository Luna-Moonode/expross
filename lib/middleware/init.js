const request = require('../request');
const response = require('../response');

module.exports.init = function exprossInit(req, res, next) {
    req.res = res;
    res.req = req;
    // request文件可能用到res对象，response文件可能用到req对象
    Object.setPrototypeOf(req, request);
    Object.setPrototypeOf(res, response);
    next();
};