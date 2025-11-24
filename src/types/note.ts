// types/note.ts

export interface Note {
    id: string;
    title: string;
    content: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateNote {
    title: string;
    content: string;
    color?: string;
}

export interface UpdateNote {
    id: string;
    title: string;
    content: string;
    color?: string;
}

export interface DeleteNote {
    id: string;
}

export interface GetNotes {
    searchQuery?: string;
}

export interface GetNote {
    id: string;
}

// Action responses

export interface ActionResponse {
    success: boolean;
    message: string;
    data?: Note[];
}

export interface SingleNoteResponse {
    success: boolean;
    message: string;
    data?: Note;
}