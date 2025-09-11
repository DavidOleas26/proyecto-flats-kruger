import mongoose from "mongoose";
import configs from "../configs/configs.js";

export const connectDB = async()=> {
    try {
        const mongo_uri = `mongodb+srv://${configs.MONGO_USER_DB}:${configs.MONGO_PASSWORD_DB}@${configs.MONGO_HOST_DB}/${configs.MONGO_DB_NAME}?retryWrites=true&w=majority&appName=ClusterBackendDO`
        await mongoose.connect( mongo_uri,);
        console.log("Conectado a mongodb");

        mongoose.connection.on('error', err => {
        console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
        });
    } catch (error) {
        console.error("Error al conectar la base de datos", error);
    }
}

