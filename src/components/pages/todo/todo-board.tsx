import { IGetTodoListPayload } from "@/types/todo";
import groupTodos from "./group-todo";

interface TodoBoardProps {
  todos: IGetTodoListPayload[];
}

function TodoBoard({ todos }: TodoBoardProps) {
  const { plan, pending, done } = groupTodos(todos);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-lg mb-2">Plan</h2>
        {plan.length === 0 ? (
          <p className="text-muted-foreground">No plan tasks.</p>
        ) : (
          plan.map((todo) => <div key={todo.id}>{todo.title}</div>)
        )}
      </div>

      <div>
        <h2 className="font-bold text-lg mb-2">Pending</h2>
        {pending.length === 0 ? (
          <p className="text-muted-foreground">No pending tasks.</p>
        ) : (
          pending.map((todo) => <div key={todo.id}>{todo.title}</div>)
        )}
      </div>

      <div>
        <h2 className="font-bold text-lg mb-2">Done</h2>
        {done.length === 0 ? (
          <p className="text-muted-foreground">No done tasks.</p>
        ) : (
          done.map((todo) => <div key={todo.id}>{todo.title}</div>)
        )}
      </div>
    </div>
  );
}


export default TodoBoard
