import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import { errorHandler } from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";


const app = express();
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.get("/", (_req, res) => {
    res.send("API is running");
});

app.use(errorHandler);
export default app;
