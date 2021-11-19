//index.js
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const dotenv    = require('dotenv');
const httpProxy = require('express-http-proxy');
const express = require('express');
const app = express();
var logger = require('morgan');
 
app.use(logger('dev'));

dotenv.config();
 
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