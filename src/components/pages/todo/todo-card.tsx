"use client";
import {
  IGetTodoList,
  ITodoStatusChangeable,
} from "@/types/todo";
import { formatDate } from "@/lib/helper/date-formatter";
import { changeTodoStatus } from "@/server/to-do-action";
import { ChangeTodoStatusInput } from "@/schema/todo";
import { useTransition } from "react";
import { priorityColor, statusColor } from "@/lib/color";

interface TodoCardProps {
  todo: IGetTodoList;
  onOpenDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoCard({
  todo,
  onOpenDetail,
  onEdit,
  onDelete,
}: TodoCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: ITodoStatusChangeable) => {
    startTransition(async () => {
      const payload: ChangeTodoStatusInput = {
        id: todo.id,
        status,
      };

      await changeTodoStatus(payload);
    });
  };

  return (
    <div className="rounded-md border border-border/40 px-3 py-2 space-y-1 hover:bg-accent/40 transition">
      {/* Title */}
      <div
        className="font-medium cursor-pointer truncate"
        onClick={() => onOpenDetail(todo.id)}
      >
        {todo.title}
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {/* Status */}
        <span className={statusColor[todo.status]}>{todo.status}</span>

        {/* Priority (optional) */}
        {todo.priority && (
          <span className={priorityColor[todo.priority]}>{todo.priority}</span>
        )}

        {/* Due date (optional) */}
        {todo.dueDate && (
          <span className="text-muted-foreground">
            Due {formatDate(new Date(todo.dueDate))}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={() => onEdit(todo.id)}
          className="text-xs hover:scale-110 transition"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="text-xs hover:scale-110 transition"
        >
          🗑
        </button>
      </div>
      {/* Quick status actions */}
      <div className="flex gap-2 text-xs">
        {todo.status !== "DONE" && (
          <button
            disabled={isPending}
            onClick={() => handleStatusChange("DONE")}
            className="text-green-600 hover:underline disabled:opacity-50"
          >
            Mark done
          </button>
        )}

        {todo.status !== "PENDING" && (
          <button
            disabled={isPending}
            onClick={() => handleStatusChange("PENDING")}
            className="text-orange-500 hover:underline disabled:opacity-50"
          >
            Pending
          </button>
        )}

        {todo.status !== "CANCELLED" && (
          <button
            disabled={isPending}
            onClick={() => handleStatusChange("CANCELLED")}
            className="text-gray-400 hover:underline disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
