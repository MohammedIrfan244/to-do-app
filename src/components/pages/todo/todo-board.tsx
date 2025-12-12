import { IGetTodoListPayload } from "@/types/todo";

interface TodoBoardProps {
  todos: IGetTodoListPayload;
}

export default function TodoBoard({ todos }: TodoBoardProps) {
  const { plan, pending, done } = todos;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div>
        <h2 className="font-bold mb-2">Plan</h2>
        {plan.map((t) => <div key={t.id}>{t.title}</div>)}
      </div>

      <div>
        <h2 className="font-bold mb-2">Pending</h2>
        {pending.map((t) => <div key={t.id}>{t.title}</div>)}
      </div>

      <div>
        <h2 className="font-bold mb-2">Done</h2>
        {done.map((t) => <div key={t.id}>{t.title}</div>)}
      </div>
    </div>
  );
}
