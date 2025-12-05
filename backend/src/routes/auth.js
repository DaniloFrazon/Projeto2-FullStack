// backend/src/routes/auth.js (CORRIGIDO PARA MONGOOSE)

const express = require('express');
const User = require('../models/User'); // Importa o Model Mongoose
const jwt = require('jsonwebtoken');

const router = express.Router();

// Função para gerar um token de autenticação
const generateToken = (user) => {
    // No Mongoose, o ID é _id
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// @route POST /api/auth/login
// @desc Login do usuário (Rota RESTful)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // 1. Validação de Campos
    if (!username || !password) {
        return res.status(400).json({ 
            message: 'Nome de usuário e senha são obrigatórios.' 
        });
    }

    try {
        // 2. BUSCA DO USUÁRIO: Usa o método estático findByUsername do Model Mongoose
        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        
        // 3. COMPARAÇÃO DE SENHA (BCrypt): 
        // Chama o método estático comparePassword que deve existir no seu Mongoose Model.
        // O hash da senha no Mongoose é user.password_hash (campo definido no Schema).
        const isMatch = await User.comparePassword(password, user.password_hash); 
        // Se você usou UserSchema.methods, a chamada seria: user.comparePassword(password)

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 4. Geração do Token e sucesso
        const token = generateToken(user);
        
        console.log(`Usuário logado: ${username}`); 

        res.json({ token, message: 'Login realizado com sucesso!' });

    } catch (error) {
        console.error("Erro no login:", error);
        // O erro 500 que você estava vendo anteriormente deve ser corrigido agora.
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

module.exports = router;