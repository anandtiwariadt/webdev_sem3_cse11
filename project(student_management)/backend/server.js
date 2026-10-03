import express from "express";
import cors from "cors";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // middleware to read JSON request bodies

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Student Management System API"
    });
});

app.use("/api/students", studentRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error("error:", err.message);
    res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});