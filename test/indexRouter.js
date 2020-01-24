const expross = require('../');
const router = expross.Router();

router.get('/1', (req, res) => {
    throw new Error('testerr');
});

// 错误处理中间件
router.use('/1', (err, req, res, next) => {
    console.log(`catch: ${err}`);
    next();
});

router.get('/1', (req, res) => {
    res.send('normal');
});

module.exports = router;