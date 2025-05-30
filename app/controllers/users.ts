import { FastifyInstance } from "fastify";
import { prisma } from "db";
import { createUserSchema, updateUserSchema } from "../models/user";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function usersRoutes(app: FastifyInstance) {
  // Lista todos os usuários
  app.get("/", async () => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        avatar: true,
        created_at: true,
      },
    });
    return { data: users };
  });

  // Busca um usuário por ID
  app.get("/:id", async (request) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        avatar: true,
        created_at: true,
      },
    });
    return { data: user };
  });

  // Cria um novo usuário
  app.post("/", async (request, reply) => {
    const data = createUserSchema.parse(request.body);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        avatar: true,
        created_at: true,
      },
    });

    return reply.status(201).send({ data: user });
  });

  // Atualiza um usuário
  app.put("/:id", async (request) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const data = updateUserSchema.parse(request.body);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        avatar: true,
        created_at: true,
      },
    });

    return { data: user };
  });

  // Remove um usuário
  app.delete("/:id", async (request, reply) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    await prisma.user.delete({ where: { id } });
    return reply.status(204).send();
  });
}
