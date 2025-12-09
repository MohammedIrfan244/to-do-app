"use server";
import { withErrorWrapper } from "@/lib/server-utils/error-wrapper";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/server-utils/get-user";
import { ITodo , IGetTodoListPayload } from "@/types/todo";
import { createTodoSchema } from "@/schema/todo";
import { z } from "zod";

type CreateTodoInput = z.infer<typeof createTodoSchema>;

export const createTodo = withErrorWrapper<ITodo , [CreateTodoInput]>(async (input: CreateTodoInput): Promise<ITodo> => {
  const validatedInput = createTodoSchema.parse(input);
  
  const userId = await getUserId();
  
  const todo = await prisma.todo.create({
    data: {
      userId,
      title: validatedInput.title,
      description: validatedInput.description,
      status: (validatedInput.status || "PLAN") as "PLAN" | "PENDING" | "DONE" | "CANCELLED" | "OVERDUE" | "ARCHIVED",
      priority: validatedInput.priority,
      tags: validatedInput.tags || [],
      dueDate: validatedInput.dueDate ? new Date(validatedInput.dueDate) : undefined,
      dueTime: validatedInput.dueTime,
      renewInterval: validatedInput.renewInterval,
      renewEvery: validatedInput.renewEvery,
      renewCustom: validatedInput.renewCustom,
      checklist: validatedInput.checklist ? {
        create: validatedInput.checklist.map(item => ({
          text: item.text,
        })),
      } : undefined,
    },
    include: {
      checklist: true,
    },
  });

  return todo as ITodo;
}); 

