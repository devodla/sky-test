const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

router.post('/signup', async (req,res,next) => {
    try {
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
        const userEmail = await User.findOne({email: email});
        if (userEmail) {
            return res.status(201).json({
                mensagem: 'E-mail já existente'
            });
        } else {
            await user.save();
            res.status(200).json(user);
        }
    } catch (e) {
        res.status(404).json({mensagem: 'mensagem de erro', erro: e});
    }
})

router.get('/buscar/:userId', async (req,res,next) => {
    try {
        const token = req.headers['authorization'];
        const userID = req.params.userId;

        if(!token) {
            return res.status(401).json({
                mensagem: 'Não autorizado, token não provisto'
            });
        }

        const SemBearer = token.replace('Bearer {','').replace('}','');
        
        const userprocuradp = await User.findById(userID, {senha:0,__v:0});
        
        //const decodedSemBearer = jwt.verify(SemBearer, config.secret);
        if (userprocuradp.token == SemBearer){
            const now = new Date;
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
    } catch (e) {
        res.status(404).json({mensagem: 'mensagem de erro', erro: e});
    }
})

router.post('/signin', async (req,res,next) => {
    try {
        const { email, senha } = req.body;
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(404).json({
                mensagem: 'Usuário e/ou senha inválidos'
            });
        }
        const valideSenha = await user.valideSenha(senha);
        
        if (!valideSenha) {
            return res.status(401).json({
                mensagem: 'Usuário e/ou senha inválidos'
            });
        }

        const token = jwt.sign({id: user._id}, config.secret, {
            expiresIn: 60 * 30
        });

        await User.findById(user._id, {senha:0,__v:0},(err, user) => {
            if (err) console.log (err);

            user.token = token;
            res.status(200).json(user);

            user.ultimo_login = new Date;
            user.save(function(err) {
                if (err) console.log (err);
            });
        });
    } catch (e) {
        res.status(404).json({mensagem: 'mensagem de erro', erro: e});
    }
})

module.exports = router;