const express = require('express');

const bodyparser = require('body-parser');

const app = express();

const feedRoutes = require('./routes/feed');

app.use(bodyparser.json())

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
//     res.setHeader('Access-Control-Allow-Headers', 'content-type', 'authorization');
//     next();
// })



app.use("/feeds", feedRoutes)

app.listen(3000);

