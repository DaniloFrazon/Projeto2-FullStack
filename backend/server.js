// backend/server.js (FINAL PARA MONGOOSE/EXPRESS)

const express = require('express');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
// 🛑 CORRIGIDO: Importa a função de conexão Mongoose (connectDB)
const connectDB = require('./src/config/db'); 
const winston = require('winston');
require('dotenv').config();

// --- CONFIGURAÇÃO INICIAL E WINSTON ---
const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Configuração do Winston para logs (Monitoramento)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

app.set('logger', logger);
logger.info('--- SERVIDOR EXPRESS INICIANDO ---');


// --- MIDDLEWARES DE SEGURANÇA E PERFORMANCE ---

// Middlewares padrões (devem vir antes das rotas)
app.use(compression());
app.use(helmet());
app.use(cors({
  origin: FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Middleware: RateLimiter (Funcionalidade RateLimiter)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas requisições feitas por este IP, tente novamente em 15 minutos.'
});
app.use('/api/', apiLimiter);

// Middleware para processar JSON
app.use(express.json());

// Adiciona o logger para o Request/Response (Monitoramento)
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});


// --- MÓDULOS DE ROTA (RESTful) ---
const authRoutes = require('./src/routes/auth');
const gameRoutes = require('./src/routes/games');

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);


// --- ROTA DE TESTE ---
app.get('/api/status', (req, res) => {
  res.json({ message: 'Backend rodando!' });
});


// --- TRATAMENTO DE ERRO GLOBAL (Monitoramento) ---
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    message: 'Erro interno do servidor. Detalhes logados.',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});


// 🛑 INICIALIZAÇÃO DO SERVIDOR (CORRIGIDO PARA MONGOOSE) 🛑
// 1. Conecta ao MongoDB/Mongoose
connectDB()
    .then(() => {
        // 2. Só inicia o servidor Express APÓS o sucesso da conexão com o DB
        app.listen(PORT, () => {
            logger.info(`Servidor rodando na porta ${PORT}`);
            logger.info('--- APLICAÇÃO PRONTA ---');
        });
    })
    .catch(err => {
        // Encerra o processo se a conexão falhar
        logger.error(`Falha CRÍTICA ao conectar ao DB ou iniciar: ${err.message}`);
        process.exit(1);
    });