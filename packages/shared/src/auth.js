"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
var zod_1 = require("zod");
exports.registerSchema = zod_1.z
    .object({
    firstName: zod_1.z.string().min(2, 'First name is required'),
    lastName: zod_1.z.string().min(2, 'Last name is required'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: zod_1.z.string().min(6, 'Confirm password must be at least 6 characters'),
    dateOfBirth: zod_1.z.string().refine(function (date) { return new Date(date).toString() !== 'Invalid Date'; }, {
        message: 'A valid date of birth is required',
    }),
})
    .refine(function (data) { return data.password === data.confirmPassword; }, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
