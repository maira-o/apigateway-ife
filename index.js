//index.js
const httpProxy = require('express-http-proxy');
const express = require('express');
const app = express();
var logger = require('morgan');
 
app.use(logger('dev'));
 
function selectProxyHost(req) {
    if (req.path.startsWith('/usuario'))
        return 'http://localhost:3000/';
    else if (req.path.startsWith('/educador'))
        return 'http://localhost:3001/';
    else if (req.path.startsWith('/crianca'))
        return 'http://localhost:5000/';
}
 
app.use((req, res, next) => {
    httpProxy(selectProxyHost(req))(req, res, next);
});
 
app.listen(10000, () => {
    console.log('API Gateway running!');
});