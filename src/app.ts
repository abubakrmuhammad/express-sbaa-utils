import express from "express";
import consola from "consola";
import { testDbConnection } from "@/lib/db";
import { env } from "@/env";
import { addResUtils } from "@/middlewares/res-utils.middleware";

const app = express();
const PORT = env.PORT;

app.use(express.json());

app.use(addResUtils());

app.get("/test", async (req, res) => {
  res.send("Hello, world!");
});

async function main() {
  await testDbConnection();

  app.listen(PORT, () => {
    consola.info(`Server running on port ${PORT}`);
  });
}

main();
