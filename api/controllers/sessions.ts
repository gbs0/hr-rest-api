import { FastifyInstance } from "fastify";
import { prisma } from "db";
import { createSessionSchema } from "../models/session";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "sua-chave-secreta-aqui";

export async function sessionsRoutes(app: FastifyInstance) {
  // Login
  app.post("/", async (request, reply) => {
    const { email, password } = createSessionSchema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ error: "Credenciais inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return reply.status(401).send({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    // Criar ou atualizar sessão
    await prisma.session.create({
      data: {
        user_id: user.id,
        token,
        ip: request.ip,
        os: request.headers["user-agent"] || "unknown",
      },
    });

    return {
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
      },
    };
  });

  // Logout
  app.delete("/", async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.status(401).send({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];
    await prisma.session.deleteMany({ where: { token } });

    return reply.status(204).send();
  });

  // Lista todas as sessões de um usuário
  app.get("/user/:userId", async (request) => {
    const { userId } = z.object({ userId: z.string() }).parse(request.params);

    const sessions = await prisma.session.findMany({
      where: { user_id: userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    return { data: sessions };
  });
}
