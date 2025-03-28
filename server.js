require("dotenv").config();  

const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 5050;

// Load MongoDB credentials from .env
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_AUTH_DB = process.env.MONGO_AUTH_DB;

const MONGO_URL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=${MONGO_AUTH_DB}`;

const client = new MongoClient(MONGO_URL);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
}
connectDB();

app.get("/");

app.get("/getUsers", async (req, res) => {
    try {
        const db = client.db(MONGO_DB_NAME);
        const users = await db.collection("users").find({}).toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

app.post("/addUser", async (req, res) => {
    try {
        const db = client.db(MONGO_DB_NAME);
        const result = await db.collection("users").insertOne(req.body);
        res.json({ message: "User added successfully", data: result });
    } catch (error) {
        res.status(500).json({ error: "Failed to insert user" });
    }
});

app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
