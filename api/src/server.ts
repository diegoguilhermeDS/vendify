
import { buildApp } from "./app.ts";

const PORT = +(process.env.PORT || 3333);

const start = async () => {
  try {
    const server = await buildApp();
    server.listen(
      {
        port: PORT,
        host: "0.0.0.0",
      },
      (err, address) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }

        console.log("\n");
        console.log(process.env.DATABASE_URL)
        console.log(`Server listening at ${address}`);
        console.log(`Docs at ${address}/docs`);
      },
    );
  } catch (err) {
    console.error("❌ Erro:", err);
    process.exit(1);
  }
};

start();
