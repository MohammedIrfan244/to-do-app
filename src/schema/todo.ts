import { z } from "zod";

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .max(300, "Description cannot exceed 300 characters")
    .optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

  tags: z.array(z.string()).optional(),

  dueDate: z.union([z.string(), z.date()]).optional(),
  dueTime: z.string().optional(),

  renewInterval: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY", "CUSTOM"]).optional(),
  renewEvery: z.number().optional(),
  renewCustom: z.string().optional(),

  checklist: z
    .array(
      z.object({
        text: z
          .string()
          .min(1, "Checklist item cannot be empty")
          .max(200, "Checklist item too long"),
      })
    )
    .optional(),

  status: z
    .enum(["PLAN", "PENDING", "DONE", "CANCELLED", "OVERDUE", "ARCHIVED"])
    .optional(),
});
