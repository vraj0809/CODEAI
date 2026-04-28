const mongoose = require("mongoose")



async function connectToDB() {

    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log("Connected to Database successfully!")
    }
    catch (err) {
        console.error("MONGODB CONNECTION ERROR:", err)
    }
}

module.exports = connectToDB