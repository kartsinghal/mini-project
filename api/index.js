import express from "express";
import serverApp from "../server/index.js";

const app = express();

app.use("/api", serverApp);

export default app;
