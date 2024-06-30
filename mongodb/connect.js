import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

const connect = async (host, port, db) => {
    try {
        await mongoose.connect(`mongodb://${host}:${port}/${db}`);

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);

        throw error;
    }
}

export default connect;