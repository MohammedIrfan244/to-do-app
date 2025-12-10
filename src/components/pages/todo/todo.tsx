"use client";

import { useState, useEffect } from "react";
import { TodoFilterInput } from "@/schema/todo";
import { IGetTodoListPayload } from "@/types/todo";
import { withClientAction } from "@/lib/helper/with-client-action";
import { getTodoList, getTodayTodos } from "@/server/to-do-action";
import { useDebounce } from "@/hooks/useDebounce";
import TodoHeader from "./todo-header";
import TodoBoard from "./todo-board";

function Todo() {
  const [todos, setTodos] = useState<IGetTodoListPayload[]>([]);
  const [todayMode, setTodayMode] = useState<boolean>(false);

  const [filters, setFilters] = useState<TodoFilterInput>({
    status: undefined,
    priority: undefined,
    tags: [],
    query: undefined,
    sortBy: undefined,
    sortOrder: undefined,
  });

  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce<string>(search, 300);

  const load = async (override?: TodoFilterInput) => {
    const finalFilters = override ?? filters;
    const action = todayMode ? getTodayTodos : getTodoList;
    const response = await withClientAction<IGetTodoListPayload[]>(() =>
      action(finalFilters)
    );
    if (response) setTodos(response);
  };

  useEffect(() => {
    load({
      ...filters,
      query: debouncedSearch || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, todayMode]);

  const applyFilters = () => {
    load(filters);
  };

  return (
    <div className="section-wrapper">
      <TodoHeader
        filters={filters}
        setFilters={setFilters}
        search={search}
        setSearch={setSearch}
        applyFilters={applyFilters}
        todayMode={todayMode}
        setTodayMode={setTodayMode}
      />

      <TodoBoard todos={todos} />
    </div>
  );
}

export default Todo;
