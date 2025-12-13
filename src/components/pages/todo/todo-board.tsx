import { IGetTodoListPayload } from "@/types/todo";
import { useState } from "react";
import TodoDetailedDialogue from "./todo-detailed-popup";
import TodoDeleteDialogue from "./todo-delete-dialogue";
import ToDoDialog from "./todo-dialogue";
import TodoCard from "./todo-card";

interface TodoBoardProps {
  todos: IGetTodoListPayload;
}

export default function TodoBoard({ todos }: TodoBoardProps) {
  const { plan, pending, done } = todos;

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleOpenDetail = (id: string) => {
    setSelectedId(id);
    setOpenDetail(true);
  };

  const handleOpenDelete = (id: string) => {
    setSelectedId(id);
    setOpenDelete(true);
  };

  const handleEdit = (id: string) => {
    setSelectedId(id);
    setOpenEdit(true);
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* PLAN */}
      <div>
        <h2 className="font-bold mb-2">Plan</h2>
        {plan.map((t) => (
          <TodoCard
            key={t.id}
            todo={t}
            onOpenDetail={handleOpenDetail}
            onEdit={handleEdit}
            onDelete={handleOpenDelete}
          />
        ))}
      </div>

      {/* PENDING */}
      <div>
        <h2 className="font-bold mb-2">Pending</h2>
        {pending.map((t) => (
          <TodoCard
            key={t.id}
            todo={t}
            onOpenDetail={handleOpenDetail}
            onEdit={handleEdit}
            onDelete={handleOpenDelete}
          />
        ))}
      </div>

      {/* DONE */}
      <div>
        <h2 className="font-bold mb-2">Done</h2>
        {done.map((t) => (
          <TodoCard
            key={t.id}
            todo={t}
            onOpenDetail={handleOpenDetail}
            onEdit={handleEdit}
            onDelete={handleOpenDelete}
          />
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selectedId && (
        <TodoDetailedDialogue
          todoId={selectedId}
          isOpen={openDetail}
          setOpen={setOpenDetail}
        />
      )}

      {/* DELETE MODAL */}
      <TodoDeleteDialogue
        todoId={selectedId}
        isOpen={openDelete}
        setOpen={setOpenDelete}
      />

      {/* EDIT MODAL - Now properly controlled */}
      {openEdit && selectedId && (
        <ToDoDialog
          todoId={selectedId}
          open={openEdit}
          onOpenChange={setOpenEdit}
          onSaved={() => {
            setOpenEdit(false);
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );
}
