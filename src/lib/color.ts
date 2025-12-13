import { IPriorityWithNone, ITodoStatusWithNone } from "@/types/todo";

export const priorityColor: Record<IPriorityWithNone, string> = {
  HIGH: "text-red-500",
  MEDIUM: "text-yellow-500",
  LOW: "text-green-500",
  NONE: "text-muted-foreground",
};  

export const statusColor: Record<ITodoStatusWithNone, string> = {
  PLAN: "text-blue-500",
  PENDING: "text-orange-500",
  DONE: "text-green-600",
  CANCELLED: "text-gray-400",
  OVERDUE: "text-red-600",
  ARCHIVED: "text-muted-foreground",
  NONE: "text-muted-foreground",
};