import express from "express";
import cors from "cors";
import cookieParser  from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import documentRoutes from "./routes/document.routes.js";
const app = express();

app.use(cors({
    origin:[ "http://localhost:5173",
        "https://mindvault-ai-tau.vercel.app"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(
  "/api/auth",
  authRoutes
);
app.use(
"/api/docs",
documentRoutes
);

app.get("/", (req,res) => {
    res.send("MindVault API Running....")
});

export default app;