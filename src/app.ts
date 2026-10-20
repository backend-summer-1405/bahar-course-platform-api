import express from "express"
import { authRouter } from "./routes/auth.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { profileRouter } from "./routes/profile.router.js";
import path from "node:path";
import { adminRouter } from "./routes/admin.router.js";

const app = express()

app.use(express.json())

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads")),
);

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/admin", adminRouter);
app.use(errorMiddleware);
export  {app}