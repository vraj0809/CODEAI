const mongoose = require("mongoose")

let isConnected = false;

async function connectToDB() {
    if (isConnected) {
        return;
    }

    try {
        mongoose.set('strictQuery', false);
        const db = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });

        isConnected = db.connections[0].readyState === 1;
        console.log("Connected to Database successfully!")
    }
    catch (err) {
        console.error("MONGODB CONNECTION ERROR:", err)
    }
}

module.exports = connectToDB