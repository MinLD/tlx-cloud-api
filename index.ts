import { createServer } from "./src/server.js";
import { env } from "./src/config/env.js";
import { connectDB, disconnectDB } from "./src/lib/prisma.js";

const app = createServer();

const start = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`TLX Cloud API is running on http://localhost:${env.PORT}`);
  });

  //Bắt các Promise bị reject mà không được xử lý.
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(async () => {
      await disconnectDB();
      process.exit(1);
    });
  });

  // Bắt lỗi runtime không được try/catch bao lại.
  process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
  });

  //Bắt tín hiệu dừng app (deploy Docker/VPS).
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  });
};

void start();
