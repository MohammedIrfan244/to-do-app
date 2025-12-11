import { IGetTodoListPayload } from "@/types/todo";

function groupTodos(todos: IGetTodoListPayload[]) {
  const plan = [];
  const pending = [];
  const done = [];

  for (const t of todos) {
    switch (t.status) {
      case "PLAN":
        plan.push(t);
        break;

      case "PENDING":
      case "OVERDUE":
        pending.push(t);
        break;

      case "DONE":
      case "CANCELLED":
        done.push(t);
        break;

      default:
        break;
    }
  }

  return { plan, pending, done };
}

export default groupTodos;