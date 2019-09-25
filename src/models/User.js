const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    nome: String,
    email: String,
    senha: String,
    telefones: [
        {
            numero: String,
            ddd: String
        }
    ],
    data_criacao: {type: Date, 'default': Date.now, index: true},
    data_atualizacao: {type: Date, 'default': Date.now, index: true},
    ultimo_login: {type: Date, 'default': Date.now, index: true},
    token: String
});

userSchema.methods.encriptarSenha = async (senha) => {
    const salt = await bcrypt.genSalt(10) //Quantidade de veces aplica o algoritmo de HASH
    return bcrypt.hash(senha, salt) //Converte a senha en caracteres indecifravel
};

module.exports = model('User', userSchema);