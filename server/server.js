// Node Packages
import express from "express";
import mongoose from "mongoose";

// Env variables
import dotenv from "dotenv";
dotenv.config();

// Routers
import userRouter from "./routes/userRouter.js";

// Server Setup
const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// MiddleWare
app.use(express.json());

// MongoDB Setup
mongoose.connect(`${process.env.MONGO_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => console.error("Failed to connect API"));
db.once("open", () => console.log("Connected to API"));

// Route Setup
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
    res.send("Home");
});
