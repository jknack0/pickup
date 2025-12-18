import { z } from 'zod';

export const registerSchema = z
    .object({
        firstName: z.string().min(2, 'First name is required'),
        lastName: z.string().min(2, 'Last name is required'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
        dateOfBirth: z.string().refine(
            (date) => {
                const birthDate = new Date(date);
                if (birthDate.toString() === 'Invalid Date') return false;
                const today = new Date();
                const eighteenYearsAgo = new Date(
                    today.getFullYear() - 18,
                    today.getMonth(),
                    today.getDate(),
                );
                return birthDate <= eighteenYearsAgo;
            },
            {
                message: 'You must be at least 18 years old',
            },
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
