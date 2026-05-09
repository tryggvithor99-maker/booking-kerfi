import "dotenv/config";
import { defineConfig } from "prisma/config";

function getDatasourceUrl(): string {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  if (tursoUrl) {
    const token = process.env.TURSO_AUTH_TOKEN;
    return token ? `${tursoUrl}?authToken=${token}` : tursoUrl;
  }
  return "file:./dev.db";
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: getDatasourceUrl(),
  },
});
