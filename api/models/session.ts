import { z } from "zod";

export const createSessionSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const sessionResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    role: z.string(),
  }),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
