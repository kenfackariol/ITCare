const express = require('express');
const app = express();
const port = 3000;

const loginRouter = require('./routes/login');
app.use('/', loginRouter);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('iTcare !');
});
app.listen(port, () => {
    console.log(`L'application écoute à l'adresse http://localhost:${port}`);
});
