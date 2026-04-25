import { createApp } from "./app.js";
import { migrate } from "./db/migrate.js";

const PORT = Number(process.env.PORT || 3000);

migrate()
  .then(() => {
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`backend-node listening on :${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[migrate] Falha:", err);
    process.exit(1);
  });
