const express           = require('express');
const dotenv            = require('dotenv');
const morgan            = require('morgan');
const cors              = require('cors');
const mongoose          = require('mongoose');
const httpProxy         = require('express-http-proxy');
const loginController   = require('./controllers/loginController');
const tokenController   = require('./controllers/tokenController');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
app.use(cors());
app.use(morgan('dev'));

mongoose.connect(
    process.env.DB_CONNECT, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
  });
  
function selectProxyHost(req, res) {
    if (req.path.startsWith('/usuario'))
        return process.env.APP_USUARIO_URL;
    else if (req.path.startsWith('/educador'))
        return process.env.APP_EDUCADOR_URL;
    else if (req.path.startsWith('/crianca'))
        return process.env.APP_CRIANCA_URL;
    else
        return res.status(404).send({ status: 404, message: "Não encontrado"});
}

app.post('/login', (req, res) => {
    loginController.login(req, res)
});

app.post('/usuario', (req, res, next) => {
    httpProxy(selectProxyHost(req, res))(req, res, next);
});

app.use((req, res, next) => {
    tokenController.validation(req, res, next)
});

app.use((req, res, next) => {
    httpProxy(selectProxyHost(req, res))(req, res, next);
});

const port = process.env.PORT;

app.listen(port, function (err) {
    console.log("index.js >>>")
    console.log('ife api gateway listening on port '+port);
    if (err) {
      console.log("err >>>")
      console.log(err)
    }
  });