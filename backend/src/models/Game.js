const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    released: { type: Date },
    rating: { type: Number, min: 0, max: 5 },
    description: { type: String },
    background_image: { type: String },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const CustomGame = mongoose.model('CustomGame', GameSchema);

// 🛑 CORREÇÃO: Cria explicitamente um ObjectId para garantir compatibilidade
CustomGame.createGame = async (gameData, userId) => {
    const newGame = await CustomGame.create({
        ...gameData,
        user_id: new mongoose.Types.ObjectId(userId) // Garante que seja um ObjectId
    });
    return { id: newGame._id, name: newGame.name };
};

CustomGame.findAllCustom = async (query) => {
    // Busca customizada: Usa RegExp para busca flexível (já estava correta)
    return CustomGame.find({ name: new RegExp(query, 'i') }).select('name background_image released rating');
};

module.exports = CustomGame;