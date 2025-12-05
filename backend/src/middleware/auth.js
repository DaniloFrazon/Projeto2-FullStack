const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Obtém o token do cabeçalho da requisição
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Retorna 401 (Não Autorizado) se o token não estiver presente
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    // Extrai o token, removendo 'Bearer '
    const token = authHeader.split(' ')[1];

    try {
        // 2. Verifica o token usando o segredo (JWT_SECRET)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Injeta o payload (ID e username) no objeto req.user
        req.user = decoded; 
        
        // Continua para a próxima rota (inserção de jogo)
        next();

    } catch (ex) {
        // Retorna 400 (Requisição Inválida) se o token for inválido/expirado
        return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }
};

module.exports = authMiddleware;