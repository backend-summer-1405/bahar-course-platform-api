import express from "express"
import { authRouter } from "./routes/auth.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { profileRouter } from "./routes/profile.router.js";

const app = express()

app.use(express.json())

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use(errorMiddleware);
export  {app}