import express from "express";
import { registerRoutes } from "./api";

async function main() {
  const app = express();
  app.use(express.json());

  const server = await registerRoutes(app);

  const port = process.env.PORT || 3001;
  server.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
}

main().catch(console.error);
