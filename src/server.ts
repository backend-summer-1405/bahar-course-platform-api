import "dotenv/config";
import { prisma } from "./utils/prisma.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

await prisma.$connect();

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
