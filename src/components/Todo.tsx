// app/page.tsx
"use client";

import { useState, useTransition, useEffect } from 'react';
import { Trash2, CheckCircle2, Circle, Plus, Pencil, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { createTodo, deleteTodo, getTodos, toggleTodo, updateTodo  } from '@/server/action'; 
import { Todo, CreateTodo} from '@/types/todo'; 

export default function SinglePageTodoApp() {
    const [allTodos, setAllTodos] = useState<Todo[]>([]);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filterStatus, setFilterStatus] = useState<"all" | "finished" | "unfinished">("all");
    const [loading, setLoading] = useState(true);
    const [filteredLoadingState, setFilteredLoadingState] = useState(false);

    // Fetch all todos for stats and recent activity (left panel)
    useEffect(() => {
        async function fetchAllTodos() {
            setLoading(true);
            const response = await getTodos({ status: "all" });
            if (response.success && response.data) {
                setAllTodos(response.data as Todo[]); 
            } else {
                toast.error(response.message || "Failed to fetch todos");
                setAllTodos([]);
            }
            setLoading(false);
        }
        fetchAllTodos();
    }, []);

    // Fetch filtered todos for right panel
    useEffect(() => {
        async function fetchFilteredTodos() {
            setFilteredLoadingState(true);
            const response = await getTodos({ status: filterStatus });
            if (response.success && response.data) {
                setTodos(response.data as Todo[]); 
            } else {
                toast.error(response.message || "Failed to fetch todos");
                setTodos([]);
            }
            setFilteredLoadingState(false);
        }
        fetchFilteredTodos();
    }, [filterStatus]);

    const refreshData = async () => {
        // Refresh all todos
        setLoading(true);
        const allResponse = await getTodos({ status: "all" });
        if (allResponse.success && allResponse.data) {
            setAllTodos(allResponse.data as Todo[]);
        }
        setLoading(false);

        // Refresh filtered todos
        setFilteredLoadingState(true);
        const filteredResponse = await getTodos({ status: filterStatus });
        if (filteredResponse.success && filteredResponse.data) {
            setTodos(filteredResponse.data as Todo[]);
        }
        setFilteredLoadingState(false);
    }

    const totalTodos = allTodos.length;
    const completedTodos = allTodos.filter(t => t.completed).length;
    const activeTodos = totalTodos - completedTodos;

    // Get all todos sorted by updatedAt (newest first), limited to 5
    const allTodosSorted = [...allTodos].sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
    }).slice(0, 5);

    // Get filtered todos for the right panel
    const filteredTodos = todos;
    
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-8 py-12">
                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-6 mb-12">
                    <StatCard label="Total Tasks" value={totalTodos} />
                    <StatCard label="Active" value={activeTodos} variant="blue" />
                    <StatCard label="Completed" value={completedTodos} variant="green" />
                </div>

                {/* Main Content - Two Column Layout */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Left Column - Creation Form & All Tasks */}
                    <div className="space-y-8">
                        {/* Form Section */}
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Add New Task</h2>
                            <TodoForm onTodoCreated={refreshData} />
                        </div>

                        {/* All Tasks Section */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Recent Activity</h2>
                                <div className="text-xs text-slate-500">{allTodosSorted.length} recent</div>
                            </div>
                            
                            <div>
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <Loader2 className="animate-spin mb-3 text-slate-400" size={24} />
                                        <span className="text-sm text-slate-400">Loading tasks...</span>
                                    </div>
                                ) : (
                                    <TodoList 
                                        todos={allTodosSorted} 
                                        onActionSuccess={refreshData}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Filtered Tasks */}
                    <div>
                        <div className="space-y-6 sticky top-24">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                                        {filterStatus === "finished" && "Completed"}
                                        {filterStatus === "unfinished" && "Active"}
                                        {filterStatus === "all" && "All Tasks"}
                                    </h2>
                                    <div className="text-xs text-slate-500">{filteredTodos.length}</div>
                                </div>
                            <div>
                                {/* here */}
                            <div className='pb-4'>
                                <TodoFilter status={filterStatus} onStatusChange={setFilterStatus} />
                            </div>
                                {filteredLoadingState ? (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <Loader2 className="animate-spin mb-3 text-slate-400" size={24} />
                                        <span className="text-sm text-slate-400">Loading...</span>
                                    </div>
                                ) : (
                                    <TodoList 
                                        todos={filteredTodos} 
                                        onActionSuccess={refreshData}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, variant = "slate" }: { label: string; value: number; variant?: "slate" | "blue" | "green" }) {
    const bgColors = {
        slate: "bg-slate-100",
        blue: "bg-blue-50",
        green: "bg-green-50"
    };
    
    const textColors = {
        slate: "text-slate-900",
        blue: "text-blue-900",
        green: "text-green-900"
    };

    const borderColors = {
        slate: "border-slate-200",
        blue: "border-blue-200",
        green: "border-green-200"
    };

    return (
        <div className={`${bgColors[variant]} border ${borderColors[variant]} rounded-lg p-6`}>
            <p className="text-xs text-slate-600 mb-2 uppercase tracking-wider">{label}</p>
            <p className={`text-3xl font-light ${textColors[variant]}`}>{value}</p>
        </div>
    );
}

function SubmitButton() {
    const [isPending] = useTransition();
    return (
        <button
            type="submit"
            disabled={isPending}
            className={`inline-flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium transition-all border border-slate-300 rounded-lg ${
                isPending 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-400 cursor-pointer"
            }`}
        >
            {isPending ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
            <span>{isPending ? "Adding..." : "Add Task"}</span>
        </button>
    );
}

function TodoForm({ onTodoCreated }: { onTodoCreated: () => void }) {
    const [error, setError] = useState<string | null>(null);
    const [formKey, setFormKey] = useState(Date.now());
    const [isPending, startTransition] = useTransition();

    const handleCreateTodo = async (formData: FormData) => {
        setError(null);
        
        startTransition(async () => {
            const title = formData.get("title") as string;
            const description = formData.get("description") as string;

            const data: CreateTodo = { title, description };

            const response = await createTodo(data);
            
            if (response.success) {
                toast.success("Task created");
                setFormKey(Date.now());
                onTodoCreated();
            } else {
                setError(response.message);
                toast.error(response.message || "Failed to create task");
            }
        });
    };

    return (
        <form key={formKey} action={handleCreateTodo} className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="space-y-4">
                <div>
                    <input
                        name="title"
                        type="text"
                        placeholder="What needs to be done?"
                        required
                        className="w-full text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        disabled={isPending}
                    />
                </div>
                <div>
                    <textarea
                        name="description"
                        placeholder="Add details... (optional but required)"
                        required
                        rows={2}
                        className="w-full text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none resize-none"
                        disabled={isPending}
                    />
                </div>
                {error && <p className="text-xs text-red-600">{error}</p>}
                <div className="flex justify-end pt-2">
                    <SubmitButton />
                </div>
            </div>
        </form>
    );
}

interface TodoFilterProps {
    status: "all" | "finished" | "unfinished";
    onStatusChange: (status: "all" | "finished" | "unfinished") => void;
}

function TodoFilter({ status, onStatusChange }: TodoFilterProps) {
    const buttons = [
        { label: "All", value: "all" },
        { label: "Active", value: "unfinished" },
        { label: "Completed", value: "finished" },
    ] as const;

    return (
        <div className="flex space-x-8 border-b border-slate-200 pb-4">
            {buttons.map((btn) => (
                <button
                    key={btn.value}
                    onClick={() => onStatusChange(btn.value)}
                    className={`text-sm font-medium transition-colors relative cursor-pointer ${
                        status === btn.value
                            ? "text-slate-900"
                            : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                    {btn.label}
                    {status === btn.value && (
                        <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                    )}
                </button>
            ))}
        </div>
    );
}

function TodoList({ todos, onActionSuccess }: { todos: Todo[], onActionSuccess: () => void }) {
    if (todos?.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="mb-3">
                    <Circle className="mx-auto text-slate-300" size={32} />
                </div>
                <p className="text-sm text-slate-400">No tasks found</p>
            </div>
        );
    }

    return (
        <div className="space-y-0 divide-y divide-slate-100 bg-white rounded-lg border border-slate-200 overflow-hidden">
            {todos.map((todo) => (
                <TodoItem 
                    key={todo.id} 
                    todo={todo} 
                    onActionSuccess={onActionSuccess}
                />
            ))}
        </div>
    );
}

function TodoItem({ todo, onActionSuccess }: { todo: Todo, onActionSuccess: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description || '');

    const isFinished = todo.completed;

    const formatDate = (dateInput?: string | Date | number) => {
        if (!dateInput) return 'Unknown';
        const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (isNaN(date.getTime())) return 'Invalid date';
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleDelete = () => {
        startTransition(async () => {
            const response = await deleteTodo({ id: todo.id });
            if (response.success) {
                toast.success("Task deleted");
                onActionSuccess();
            } else {
                toast.error(response.message || "Deletion failed");
            }
        });
    };

    const handleToggle = () => {
        startTransition(async () => {
            const response = await toggleTodo(todo.id);

            if (response.success) {
                toast.success(response.data?.completed ? "Marked complete" : "Marked incomplete");
                onActionSuccess();
            } else {
                toast.error(response.message || "Toggle failed");
            }
        });
    };

    const handleSave = () => {
        if (!title.trim() || !description.trim()) {
            toast.error("Title and description required");
            return;
        }

        startTransition(async () => {
            const response = await updateTodo({
                id: todo.id,
                title: title.trim(),
                description: description.trim(),
            });

            if (response.success) {
                toast.success("Task updated");
                setIsEditing(false);
                onActionSuccess();
            } else {
                toast.error("Update failed");
                setTitle(todo.title);
                setDescription(todo.description || '');
            }
        });
    };

    const handleCancel = () => {
        setTitle(todo.title);
        setDescription(todo.description || '');
        setIsEditing(false);
    };

    return (
        <div className={`px-6 py-5 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            {isEditing ? (
                <div className="space-y-3">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full pb-2 text-base font-medium text-slate-900 focus:outline-none"
                        placeholder="Title"
                        disabled={isPending}
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        className="w-full pb-2 text-sm text-slate-700 focus:outline-none resize-none"
                        placeholder="Description"
                        disabled={isPending}
                    />
                    <div className="flex space-x-2 justify-end pt-3">
                        <button 
                            onClick={handleCancel} 
                            disabled={isPending}
                            className="inline-flex items-center cursor-pointer space-x-1 px-3 py-1.5 text-xs border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors rounded"
                        >
                            <X size={14} /><span>Cancel</span>
                        </button>
                        <button 
                            onClick={handleSave} 
                            disabled={isPending || !title.trim() || !description.trim()}
                            className={`inline-flex items-center space-x-1 px-3 py-1.5 text-xs rounded transition-all ${
                                isPending || !title.trim() || !description.trim()
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                    : 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer'
                            }`}
                        >
                            {isPending ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                            <span>{isPending ? 'Saving' : 'Save'}</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-start justify-between group">
                    <div 
                        onClick={() => setIsEditing(true)} 
                        className="flex-1 min-w-0 pr-6 cursor-pointer"
                    >
                        <h3 className={`text-base font-medium mb-1 ${
                            isFinished 
                                ? 'line-through text-slate-400' 
                                : 'text-slate-900'
                        }`}>
                            {todo.title}
                        </h3>
                        <p className={`text-sm mb-2 ${
                            isFinished 
                                ? 'line-through text-slate-300' 
                                : 'text-slate-600'
                        }`}>
                            {todo.description}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-slate-400">
                            <span>Created: {formatDate(todo.createdAt)}</span>
                            {todo.updatedAt && todo.updatedAt !== todo.createdAt && (
                                <span>• Updated: {formatDate(todo.updatedAt)}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleToggle}
                            aria-label={isFinished ? "Mark incomplete" : "Mark complete"}
                            disabled={isPending}
                            className={`p-1 transition-colors cursor-pointer ${
                                isFinished 
                                    ? 'text-green-600 hover:text-green-700' 
                                    : 'text-slate-300 hover:text-slate-400'
                            }`}
                        >
                            {isFinished ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </button>

                        <button
                            onClick={() => setIsEditing(true)}
                            aria-label="Edit task"
                            disabled={isPending}
                            className="p-1 text-slate-300 cursor-pointer hover:text-slate-600 transition-colors"
                        >
                            <Pencil size={18} />
                        </button>
                        
                        <button
                            onClick={handleDelete}
                            aria-label="Delete task"
                            disabled={isPending}
                            className="p-1 text-slate-300 hover:text-red-600 cursor-pointer transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}