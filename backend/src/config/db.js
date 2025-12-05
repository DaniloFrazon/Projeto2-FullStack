const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/projeto02_db", {
            minPoolSize: 2, 
            maxPoolSize: 10,
            autoIndex: true
        });
        console.log("✅ MongoDB/Mongoose: Conexão estabelecida com Pool.");
        return mongoose.connection;
    } catch (err) {
        console.error("❌ Erro de Conexão com MongoDB:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;