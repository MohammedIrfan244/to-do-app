import { IGetTodoListPayload } from "@/types/todo";

interface TodoBoardProps {
  todos: IGetTodoListPayload[];
}

function TodoBoard({ todos }: TodoBoardProps) {
  return (
    <div>
      {todos.length === 0
        ? "No todos found."
        : todos.map((todo) => <div key={todo.id}>{todo.title}</div>)}
    </div>
  );
}

export default TodoBoard;
