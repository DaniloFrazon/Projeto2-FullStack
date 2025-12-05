const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Necessário para checar se o ID é do MongoDB
const Game = require('../models/Game'); // Model Mongoose
const authMiddleware = require('../middleware/auth'); // Middleware de autenticação
const { default: fetch } = require('node-fetch');

// --- Variáveis de Configuração ---
const RAWG_API_KEY = process.env.RAWG_API_KEY;


// @route POST /api/games
// @desc Cria um novo jogo customizado (PROTEGIDA)
router.post('/', authMiddleware, async (req, res) => {
    // O ID do usuário (Mongoose ObjectId) é injetado no req.user pelo middleware JWT.
    const userId = req.user.id;
    const gameData = req.body;

    // 1. Validação de campos (Exemplo básico)
    if (!gameData.name || !gameData.rating || !userId) {
        return res.status(400).json({ message: 'Nome, avaliação e ID do usuário são obrigatórios.' });
    }

    try {
        // 2. Criação do jogo usando o método Mongoose do Model
        const newGame = await Game.createGame(gameData, userId);

        // TODO: Inserir a lógica de Invalidação de Cache do Redis aqui (Funcionalidade 6)

        return res.status(201).json({
            message: 'Jogo inserido com sucesso! O cache foi invalidado.',
            game: newGame
        });
    } catch (error) {
        // 🛑 LOG CRÍTICO: Registra o erro real no terminal do Docker
        console.error("ERRO CRÍTICO ao inserir jogo customizado (Mongoose):", error);
        return res.status(500).json({ message: 'Erro interno do servidor ao inserir jogo.' });
    }
});


// @route GET /api/games/search?q=:query
// @desc Busca jogos customizados e jogos da API RAWG (Funcionalidade 1 e 2)
router.get('/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ message: 'Parâmetro de busca (q) é obrigatório.' });
    }

    try {
        // 1. Busca no Banco de Dados (Mongoose)
        const customGames = await Game.findAllCustom(query);

        // 2. Busca na API RAWG (Funcionalidade 1)
        const rawgUrl = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}`;
        const rawgResponse = await fetch(rawgUrl);

        // 🛑 VERIFICAÇÃO CRÍTICA DE STATUS RAWG (Impede o erro SyntaxError HTML)
        if (!rawgResponse.ok) {
            console.error(`ERRO CRÍTICO RAWG: Status ${rawgResponse.status}. Possível chave inválida ou limite excedido.`);
            
            // Retorna apenas resultados customizados + aviso
            return res.json({
                total: customGames.length,
                results: customGames,
                rawg_warning: "Falha ao conectar na API RAWG. Apenas resultados customizados foram retornados."
            });
        }
        
        // Se a resposta for OK (rawgResponse.ok é true)
        const rawgData = await rawgResponse.json();
        const apiGames = rawgData.results || [];

        // 3. Combina e retorna os resultados (Funcionalidade 2)
        const combinedResults = [...customGames, ...apiGames];

        return res.json({
            total: combinedResults.length,
            results: combinedResults
        });

    } catch (error) {
        // Este catch agora só será atingido se houver um erro interno (Mongoose/código)
        console.error("Erro ao buscar ou combinar jogos:", error);
        return res.status(500).json({ message: 'Erro interno do servidor durante a busca.' });
    }
});


// @route GET /api/games/custom
// @desc Retorna todos os jogos customizados, ordenados do mais recente
router.get('/custom', async (req, res) => {
    try {
        const customGames = await Game.find({})
            .sort({ _id: -1 }) // -1 para ordem decrescente (mais recente primeiro)
            .select('name background_image released rating'); // Seleciona os campos que o frontend espera

        return res.json({ 
            total: customGames.length,
            results: customGames
        });

    } catch (error) {
        console.error("Erro ao buscar lista de jogos customizados:", error);
        return res.status(500).json({ message: 'Erro interno ao buscar lista customizada.' });
    }
});


// @route GET /api/games/:id
// @desc Retorna os detalhes de um jogo (Customizado ou RAWG)
router.get('/:id', async (req, res) => {
    const gameId = req.params.id;

    try {
        // 1. Tenta buscar no MongoDB/Mongoose (Jogo customizado)
        // Checa se o ID é um ObjectId válido do Mongoose (24 caracteres hexadecimais)
        if (mongoose.Types.ObjectId.isValid(gameId) && gameId.length === 24) {
             const customGame = await Game.findById(gameId);
             if (customGame) {
                 // Jogo customizado encontrado, retorna os detalhes
                 return res.json({ source: 'Custom', ...customGame.toObject() });
             }
        }

        // 2. Busca na API RAWG (Jogo externo)
        const rawgDetailUrl = `https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_KEY}`;
        const rawgResponse = await fetch(rawgDetailUrl); // Reutiliza o 'fetch' que já está importado

        if (rawgResponse.status === 404) {
            // Se o jogo não for encontrado na RAWG (e não for customizado), retorna 404
            return res.status(404).json({ message: 'Jogo não encontrado.' });
        }

        // Se houver outro erro da API RAWG (além do 404), lança um erro
        if (!rawgResponse.ok) {
            throw new Error(`RAWG API Error: Status ${rawgResponse.status}`);
        }

        const rawgData = await rawgResponse.json();

        // 3. Retorna os detalhes da RAWG
        return res.json({ source: 'RAWG', ...rawgData });

    } catch (error) {
        // Se houver um erro de rede, Mongoose, ou API, ele será capturado aqui
        console.error(`Erro ao buscar detalhes do jogo com ID ${gameId}:`, error);
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar detalhes do jogo.' });
    }
});


module.exports = router;