import { createServer } from "./src/server.js";
import { env } from "./src/config/env.js";

const app = createServer();

app.listen(env.PORT, () => {
  console.log(`TLX Cloud API is running on http://localhost:${env.PORT}`);
});