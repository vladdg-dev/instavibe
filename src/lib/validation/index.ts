import { z } from 'zod';

export const signupValidation = z.object({
  name: z.string().min(2, { message: 'Your name is too short' }),
  username: z.string().min(2, { message: 'Your username is too short' }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Your password should be at least 8 characters' }),
});

export const signinValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Invalid password' }),
});

export const postValidation = z.object({
  caption: z.string().min(5).max(200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
});
