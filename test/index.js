const expross = require('../');
const app = expross();
const port = 3000;
const indexRouter = require('./indexRouter');

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});

app.use('/users', indexRouter);

module.exports = app;
