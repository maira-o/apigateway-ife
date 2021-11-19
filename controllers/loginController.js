const tokenController = require('../controllers/tokenController');
const { loginValidation, isEmail } = require('../validations');

const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

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

    const token = tokenController.generateToken(user);
    res.status(200).json({ status: 200, message: "Login efetuado com sucesso" , token: token });
};