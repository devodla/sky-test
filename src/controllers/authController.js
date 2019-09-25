const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

router.post('/signup', async (req,res,next) => {
    const { nome, email, senha, telefones } = req.body;
    const user = new User ({
        nome,
        email,
        senha,
        telefones
    })
    user.senha = await user.encriptarSenha(user.senha);
    const token =  jwt.sign({ id: user._id}, config.secret, {
        expiresIn: 60 * 30
    });
    user.token = token;
    await user.save();

    res.json({mensagem: 'Autenticado', Bearer: token})
})

router.get('/signup/:userId', async (req,res,next) => {
    const token = req.headers['authorization'];
    const userID = req.params.userId;

    if(!token) {
        return res.status(401).json({
            mensagem: 'Não autorizado, token não provisto'
        });
    }

    const SemBearer = token.replace('Bearer {','').replace('}','');
    
    const userprocuradp = await User.findById(userID);
    
    //const decodedSemBearer = jwt.verify(SemBearer, config.secret);
    if (userprocuradp.token == SemBearer){
        const now = new Date();
        //console.log(now.getUTCMinutes() - userprocuradp.ultimo_login.getUTCMinutes());
        if ((now.getUTCMinutes() - userprocuradp.ultimo_login.getUTCMinutes())>=30) {
            return res.status(401).json({
                mensagem: 'Sessão inválida'
            });
        } else {
            return res.json(userprocuradp);
        }
    } else {
        return res.status(401).json({
            mensagem: 'Não autorizado'
        });
    }
})

router.post('/signin', (req,res,next) => {
    res.json('signin');
})

router.get('/buscador', (req,res,next) => {
    res.json('buscador');
})

module.exports = router;