const PORT = Number(process.env.PORT || 3000);
import { createApp } from "./app.js";

const app = createApp();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`backend-node listening on :${PORT}`);
});
