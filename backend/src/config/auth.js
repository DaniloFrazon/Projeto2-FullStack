// backend/src/config/auth.js
const jwt = require('jsonwebtoken');

// A função de middleware é definida aqui
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // 401 Unauthorized: Nenhum token
        return res.status(401).json({ 
            message: 'Acesso negado. Token de autenticação é obrigatório.' 
        });
    }

    // Tenta verificar e validar o token (Falhas de identificação e autenticação)
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // 403 Forbidden: Token inválido ou expirado (invalidação correta)
            // Log de segurança para tentativas de acesso inválidas
            req.app.get('logger').error(`Tentativa de acesso não autorizado com token inválido. IP: ${req.ip}`);
            return res.status(403).json({ 
                message: 'Token inválido ou expirado. Faça login novamente.' 
            });
        }
        
        req.user = user; 
        next(); // Autoriza e prossegue
    });
};

module.exports = {
    authenticateToken 
};