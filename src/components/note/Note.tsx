"use client";

import { useState, useTransition, useEffect } from 'react';
import { Trash2, Plus, Pencil, Save, X, Loader2, Search, StickyNote } from 'lucide-react';
import { toast } from 'sonner';

import { createNote, deleteNote, getNotes, updateNote } from '@/server/note-action';
import { Note, CreateNote } from '@/types/note';

const NOTE_COLORS = [
    { name: 'Yellow', value: '#fef3c7' },
    { name: 'Pink', value: '#fce7f3' },
    { name: 'Blue', value: '#dbeafe' },
    { name: 'Green', value: '#dcfce7' },
    { name: 'Purple', value: '#f3e8ff' },
    { name: 'Orange', value: '#fed7aa' },
];

export default function NotesApp() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async (search?: string) => {
        setLoading(true);
        const response = await getNotes({ searchQuery: search });
        if (response.success && response.data) {
            setNotes(response.data as Note[]);
        } else {
            toast.error(response.message || "Failed to fetch notes");
            setNotes([]);
        }
        setLoading(false);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        fetchNotes(query);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-light text-slate-900 mb-2">Notes</h1>
                            <p className="text-sm text-slate-500">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</p>
                        </div>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="inline-flex items-center space-x-2 px-4 py-2.5 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all rounded-lg cursor-pointer"
                        >
                            <Plus size={16} />
                            <span>New Note</span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 transition-colors"
                        />
                    </div>
                </div>

                {/* Create Note Modal */}
                {isCreating && (
                    <CreateNoteModal
                        onClose={() => setIsCreating(false)}
                        onNoteCreated={() => {
                            setIsCreating(false);
                            fetchNotes(searchQuery);
                        }}
                    />
                )}

                {/* Notes Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="animate-spin mb-3 text-slate-400" size={32} />
                        <span className="text-sm text-slate-400">Loading notes...</span>
                    </div>
                ) : notes.length === 0 ? (
                    <div className="text-center py-24">
                        <StickyNote className="mx-auto mb-4 text-slate-300" size={48} />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No notes yet</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            {searchQuery ? 'No notes match your search' : 'Create your first note to get started'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="inline-flex items-center space-x-2 px-4 py-2.5 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all rounded-lg cursor-pointer"
                            >
                                <Plus size={16} />
                                <span>Create Note</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {notes.map((note) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onNoteUpdated={() => fetchNotes(searchQuery)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function CreateNoteModal({ onClose, onNoteCreated }: { onClose: () => void; onNoteCreated: () => void }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0].value);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            toast.error("Title and content are required");
            return;
        }

        startTransition(async () => {
            const data: CreateNote = {
                title: title.trim(),
                content: content.trim(),
                color: selectedColor
            };

            const response = await createNote(data);

            if (response.success) {
                toast.success("Note created");
                onNoteCreated();
            } else {
                toast.error(response.message || "Failed to create note");
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Create New Note</h2>
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Note title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isPending}
                            className="w-full text-xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <textarea
                            placeholder="Start writing..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isPending}
                            rows={10}
                            className="w-full text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-2">Color</label>
                        <div className="flex space-x-2">
                            {NOTE_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setSelectedColor(color.value)}
                                    disabled={isPending}
                                    className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                                        selectedColor === color.value
                                            ? 'border-slate-900 scale-110'
                                            : 'border-slate-200 hover:border-slate-400'
                                    }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors rounded-lg cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !title.trim() || !content.trim()}
                            className={`inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                isPending || !title.trim() || !content.trim()
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer'
                            }`}
                        >
                            {isPending ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                            <span>{isPending ? 'Creating...' : 'Create Note'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function NoteCard({ note, onNoteUpdated }: { note: Note; onNoteUpdated: () => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [selectedColor, setSelectedColor] = useState(note.color);
    const [isPending, startTransition] = useTransition();

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

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handleSave = () => {
        if (!title.trim() || !content.trim()) {
            toast.error("Title and content are required");
            return;
        }

        startTransition(async () => {
            const response = await updateNote({
                id: note.id,
                title: title.trim(),
                content: content.trim(),
                color: selectedColor
            });

            if (response.success) {
                toast.success("Note updated");
                setIsEditing(false);
                onNoteUpdated();
            } else {
                toast.error("Update failed");
                setTitle(note.title);
                setContent(note.content);
                setSelectedColor(note.color);
            }
        });
    };

    const handleDelete = () => {
        startTransition(async () => {
            const response = await deleteNote({ id: note.id });
            if (response.success) {
                toast.success("Note deleted");
                onNoteUpdated();
            } else {
                toast.error(response.message || "Deletion failed");
            }
        });
    };

    const handleCancel = () => {
        setTitle(note.title);
        setContent(note.content);
        setSelectedColor(note.color);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div
                className="rounded-lg border-2 border-slate-300 p-4 flex flex-col h-80 transition-all"
                style={{ backgroundColor: selectedColor }}
            >
                <div className="flex-1 space-y-3 overflow-y-auto">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isPending}
                        className="w-full text-base font-semibold text-slate-900 focus:outline-none bg-transparent"
                        placeholder="Title"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isPending}
                        rows={8}
                        className="w-full text-sm text-slate-700 focus:outline-none resize-none bg-transparent"
                        placeholder="Content"
                    />
                    <div className="flex flex-wrap gap-1">
                        {NOTE_COLORS.map((color) => (
                            <button
                                key={color.value}
                                type="button"
                                onClick={() => setSelectedColor(color.value)}
                                disabled={isPending}
                                className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                                    selectedColor === color.value
                                        ? 'border-slate-900 scale-110'
                                        : 'border-slate-300 hover:border-slate-600'
                                }`}
                                style={{ backgroundColor: color.value }}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex justify-end space-x-2 pt-3 mt-3 border-t border-slate-300">
                    <button
                        onClick={handleCancel}
                        disabled={isPending}
                        className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isPending || !title.trim() || !content.trim()}
                        className={`p-1.5 transition-colors ${
                            isPending || !title.trim() || !content.trim()
                                ? 'text-slate-400 cursor-not-allowed'
                                : 'text-slate-900 hover:text-slate-600 cursor-pointer'
                        }`}
                    >
                        {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="group rounded-lg border border-slate-200 hover:border-slate-300 p-4 flex flex-col h-80 transition-all hover:shadow-md cursor-pointer"
            style={{ backgroundColor: note.color }}
            onClick={() => setIsEditing(true)}
        >
            <div className="flex-1 overflow-hidden">
                <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2">
                    {note.title}
                </h3>
                <p className="text-sm text-slate-700 line-clamp-6 whitespace-pre-wrap">
                    {note.content}
                </p>
            </div>
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-300">
                <span className="text-xs text-slate-500">
                    {formatDate(note.updatedAt)}
                </span>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                        }}
                        disabled={isPending}
                        className="p-1 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                        }}
                        disabled={isPending}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}