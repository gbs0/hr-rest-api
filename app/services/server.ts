import Fastify from "fastify";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { prisma } from "db";
import { usersRoutes } from "../controllers/users";
import { sessionsRoutes } from "../controllers/sessions";

const app = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

// Configuração do Fastify
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Configuração do CORS
app.register(cors, {
  origin: true,
  credentials: true,
});

// Registro das rotas
app.register(usersRoutes, { prefix: "/api/users" });
app.register(sessionsRoutes, { prefix: "/api/sessions" });

app.get("/", async () => {
  return { status: "Olá mundo!" };
});

// Rota de healthcheck
app.get("/health", async () => {
  return { status: "ok" };
});

const start = async () => {
  try {
    await app.listen({ port: 3333, host: "0.0.0.0" });
    console.log("🚀 Server is running on http://localhost:3333");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
