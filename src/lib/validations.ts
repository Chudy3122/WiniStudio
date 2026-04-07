import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  email: z.string().email('Nieprawidłowy adres email'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Wiadomość musi mieć co najmniej 10 znaków'),
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const portfolioItemSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany'),
  titleEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  category: z.enum(['PHOTOGRAPHY', 'VIDEO', 'THREE_D']),
  imageUrl: z.string().url().optional().or(z.literal('')),
  blobKey: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  thumbnail: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type PortfolioItemFormData = z.infer<typeof portfolioItemSchema>;
