// backend/src/config/redis.js
const Redis = require('ioredis');

// Configuração básica do REDIS (Cache - Funcionalidade 12)
// Lê a URL do Redis das variáveis de ambiente
const redisClient = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

redisClient.on('connect', () => {
    console.log('Redis: Conexão estabelecida com sucesso.');
});

redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
    // Em produção, você pode querer um tratamento de erro mais robusto
});

module.exports = redisClient;