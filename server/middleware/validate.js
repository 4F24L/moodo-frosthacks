import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.reduce((acc, err) => {
      const field = err.path[0];
      if (field && !acc[field]) acc[field] = err.message;
      return acc;
    }, {});
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }
  req.body = result.data;
  next();
};
