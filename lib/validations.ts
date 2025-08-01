import {z} from 'zod';
export const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  university_id: z.coerce.number(),
  universityCard: z.string().nonempty('University card is required'),
  password: z.string().min(6),
})

export const signInSchema = z.object({

  email: z.string().email(),
  password: z.string().min(6),
})