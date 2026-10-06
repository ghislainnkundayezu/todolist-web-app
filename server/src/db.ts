import mongoose from 'mongoose';
import 'dotenv/config';

const DatabaseConnection = async () => {
    try {
        const username = encodeURIComponent(process.env.DB_USERNAME || '');
        const password = encodeURIComponent(process.env.DB_PASSWORD || '');
        const databaseUrl = `mongodb+srv://${username}:${password}@cluster0.aam2my6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
        const connection = await mongoose.connect(databaseUrl, {
            dbName: process.env.DB_COLLECTION,
        });
        console.log('Database Successfully Connected');
        console.log(`Database Name: ${connection.connections[0].name}`);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log('Connection to the database failed:', message);
    }
};

export default DatabaseConnection;
