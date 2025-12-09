import { z } from "zod";

// TODO THINGS

// Schema for creating a new to-do item
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

  renewStart: z.union([z.string(), z.date()]).optional(),
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

// Schema for filtering and sorting to-do items
export const todoFilterSchema = z.object({
  status: z.enum(["PLAN", "PENDING", "DONE", "CANCELLED", "OVERDUE", "ARCHIVED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  tags: z.array(z.string()).optional(),
  createdAtSort: z.enum(["ASC", "DESC"]).optional(),
  dueDateSort: z.enum(["ASC", "DESC"]).optional(),
  prioritySort: z.enum(["ASC", "DESC"]).optional(),
});

// Schema for searching to-do items by title or description
export const searchTodoSchema = z.object({
  query: z.string().min(1, "Search query cannot be empty"),
});

// Schema for getting a specific to-do item by ID
export const getTodoByIdSchema = z.object({
  id: z.string().uuid("Invalid Todo ID"),
});

// Schema for updating a to-do item
export const updateTodoSchema = z.object({
  id: z.string().uuid("Invalid Todo ID"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string().max(300, "Description cannot exceed 300 characters").optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  tags: z.array(z.string()).optional(),
  dueDate: z.union([z.string(), z.date()]).optional(),
  dueTime: z.string().optional(),
  renewStart: z.union([z.string(), z.date()]).optional(),
  renewInterval: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY", "CUSTOM"]).optional(),
  renewEvery: z.number().optional(),
  renewCustom: z.string().optional(),
  checklist: z
    .array(
      z.object({
        id: z.string().uuid("Invalid Checklist Item ID").optional(),
        text: z
          .string()
          .min(1, "Checklist item cannot be empty")
          .max(200, "Checklist item too long"),
      })
    ).optional(),
  status: z
    .enum(["PLAN", "PENDING", "DONE", "CANCELLED", "OVERDUE", "ARCHIVED"])
    .optional(),
});

// Schema for deleting a to-do item
export const deleteTodoSchema = z
  .object({
    id: z.string().uuid("Invalid Todo ID"),
  })

  // Schema for bulk deleting to-do items
export const bulkDeleteTodoSchema = z.object({
  ids: z.array(z.string().uuid("Invalid Todo ID")).min(1, "At least one ID must be provided"),
});

// Schema for changing the status of a to-do item
export const changeTodoStatusSchema = z.object({
  id: z.string().uuid("Invalid Todo ID"),
  status: z.enum(["PLAN", "PENDING", "DONE", "CANCELLED", "OVERDUE", "ARCHIVED"]),
});

// Schema for bulk changing the status of to-do items
export const bulkChangeTodoStatusSchema = z.object({
  ids: z.array(z.string().uuid("Invalid Todo ID")).min(1, "At least one ID must be provided"),
  status: z.enum(["PLAN", "PENDING", "DONE", "CANCELLED", "OVERDUE", "ARCHIVED"]),
});

// Schema for marking/unmarking a checklist item
export const markChecklistItemSchema = z.object({
  todoId: z.string().uuid("Invalid Todo ID"),
  checklistItemId: z.string().uuid("Invalid Checklist Item ID"),
});

// Schema for restore from archive
export const restoreTodoFromArchiveSchema = z.object({
  id: z.string().uuid("Invalid Todo ID"),
});