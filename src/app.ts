import express from "express";
import consola from "consola";
import morgan from "morgan";
import { env } from "@/env";
import { addResUtils, testDbConnection } from "@/lib";
import customerFormRouter from "@/customer-forms/router";

const app = express();
const PORT = env.PORT;

app.use(express.json());

app.use(addResUtils());
app.use(morgan("dev"));

app.get("/test", async (req, res) => {
  res.send("Hello, world!");
});

app.use("/customer-forms", customerFormRouter);

async function main() {
  await testDbConnection();

  app.listen(PORT, () => {
    consola.info(`Server running on port ${PORT}`);
  });
}

main();
