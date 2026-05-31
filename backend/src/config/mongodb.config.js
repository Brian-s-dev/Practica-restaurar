import mongoose from 'mongoose';
import ENVIRONMENT from './environment.config.js';

const connectMongoDB = async () => {
    try {
        await mongoose.connect(ENVIRONMENT.MONGO_DB_CONNECTION_STRING, {
            dbName: ENVIRONMENT.MONGO_DB_NAME
        });
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1);
    }
};

export default connectMongoDB;