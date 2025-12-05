// backend/src/models/User.js (CORRIGIDO PARA MONGOOSE)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
});

// Método para comparar a senha (BCrypt)
UserSchema.statics.comparePassword = function(password, hash) {
    return bcrypt.compare(password, hash);
};

// Método estático para buscar usuário
UserSchema.statics.findByUsername = function(username) {
    return this.findOne({ username: username });
};

module.exports = mongoose.model('User', UserSchema);