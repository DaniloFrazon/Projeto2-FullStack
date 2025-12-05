// backend/seed.js (FINAL PARA MONGOOSE)

const connectDB = require('./src/config/db'); // Conexão Mongoose
const mongoose = require('mongoose');
const User = require('./src/models/User'); // Modelos Mongoose
const Game = require('./src/models/Game'); // Modelos Mongoose
const bcrypt = require('bcryptjs');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

async function runSeed() {
    logger.info('--- ⚙️ INICIANDO SCRIPT DE SEED PARA MONGODB ---');
    try {
        // Conecta ao MongoDB (usa o Pool)
        await connectDB(); 

        // 1. Limpeza de Dados Antigos (Mongoose)
        await User.deleteMany({});
        await Game.deleteMany({});
        logger.info('✅ Limpeza de coleções concluída.');

        // 2. Hash da Senha e Criação do Usuário de Teste
        const TEST_USERNAME = 'testuser';
        const TEST_PASSWORD_PLAINTEXT = '123456'; 
        const passwordHash = await bcrypt.hash(TEST_PASSWORD_PLAINTEXT, 10);
        
        const testUser = await User.create({
            username: TEST_USERNAME,
            password_hash: passwordHash,
        });
        logger.info(`✅ Usuário de Login '${testUser.username}' (Senha: 123456) criado.`);

        // 3. Inserção de Conteúdo de Teste (Mongoose)
        await Game.create({
            name: 'A Lenda de Andirá (Mongo)',
            released: new Date('2025-12-05'),
            rating: 4.8,
            description: 'RPG clássico com desafios Fullstack.',
            background_image: 'https://via.placeholder.com/400x200?text=MONGO+CUSTOM',
            user_id: testUser._id // Associa ao usuário de teste
        });
        logger.info('✅ Jogo customizado de teste inserido.');


    } catch (err) {
        logger.error('❌ ERRO CRÍTICO NO SEEDING:', err);
        // Não encerramos o processo aqui para que o NPM possa tentar o 'npm start'
    } finally {
        // Mongoose usa disconnect para encerrar a conexão do script de seed
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            logger.info('--- 🏁 SEEDING CONCLUÍDO. Conexão Mongoose encerrada. ---');
        }
        // O processo sairá automaticamente após o script terminar
    }
}

runSeed();