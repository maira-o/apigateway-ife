//index.js
// require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const dotenv    = require('dotenv');
const httpProxy = require('express-http-proxy');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
var logger = require('morgan');
 
app.use(logger('dev'));
app.use(cors());

dotenv.config();

mongoose.connect(
    process.env.DB_CONNECT, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
  });
  
function selectProxyHost(req) {
    if (req.path.startsWith('/usuario'))
        return process.env.APP_USUARIO_URL;
    else if (req.path.startsWith('/educador'))
        return process.env.APP_EDUCADOR_URL;
    else if (req.path.startsWith('/crianca'))
        return process.env.APP_CRIANCA_URL;
}
 
app.use((req, res, next) => {
    httpProxy(selectProxyHost(req))(req, res, next);
});

const port = process.env.PORT;
 
app.listen(port, () => {
    console.log('IFE API Gateway is running! :)');
});