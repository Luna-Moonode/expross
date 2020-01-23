const expross = require('../');
const app = expross();
const port = 3000;

app.get('/', (req, res, next) => {
    next();
}).get('/', (req, res, next) => {
    next(new Error('index err'))
});
// app.post('/post', (req, res, next) => {
//     res.send('post');
// });


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
