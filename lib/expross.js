const Application = require('./application');
const Router =require('./router');

function createApplication() {
    return new Application();
}

module.exports = createApplication;
module.exports.Router = Router;