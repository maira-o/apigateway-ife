const Joi               = require('joi');
const validator         = require("email-validator");
const bcrypt            = require('bcryptjs');
const Usuario           = require('../models/Usuario');
const tokenController   = require('../controllers/tokenController');

exports.login = async (req, res) => {
    const data = req.body;

    const isComplete = loginValidation(data);
    if(isComplete.error){
        return res.status(400).send({ status: 400, message: error.details[0].message });
    }

    let usuario;
    if(isEmail(data.email)){
        usuario = await Usuario.findOne({"email": data.email});
    }

    if(!usuario) {
        return res.status(401).json({ status: 401, message: "Este usuário não existe"});
    }

    const validPassword = await bcrypt.compare(data.senha, usuario.senha);
    if(!validPassword){
        return res.status(403).json({ status: 403, message: "Senha incorreta"});
    }

    const token = tokenController.generateToken(usuario);
    res.status(201).json({ status: 201, message: "Login efetuado com sucesso" , token: token });
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        senha: Joi.string().required(),
    });
    return schema.validate(data);
}

const isEmail = (email) => { return validator.validate(email) }