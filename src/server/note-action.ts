"use server"

import { error, info, success } from "@/lib/logger"
import { prisma } from "@/lib/prisma"
import { ActionResponse, CreateNote, DeleteNote, GetNotes, Note, SingleNoteResponse, UpdateNote } from "@/types/note"

export const createNote = async (data: CreateNote): Promise<SingleNoteResponse> => {
    try {
        const { title, content, color } = data

        if (!title || !content) return {
            message: "Title and content are required",
            success: false
        }

        info(`Creating note with title ${title}`)

        const note = await prisma.note.create({
            data: {
                title,
                content,
                color: color || "#fef3c7"
            }
        })

        success(`Created note with id ${note.id}`)

        return {
            message: "Note created successfully",
            success: true,
            data: note as Note
        }

    } catch (e) {
        error(`Error creating note ${data.title}`, e)
        return {
            message: "Something went wrong",
            success: false
        }
    }
}

export const updateNote = async (data: UpdateNote): Promise<SingleNoteResponse> => {
    try {
        const { title, content, color } = data
        if (!title || !content || !data.id) return {
            message: "Title and content are required",
            success: false
        }

        info(`Updating note with id ${data.id}`)
        info("Updating data", data)

        const note = await prisma.note.update({
            where: {
                id: data.id
            },
            data: {
                title,
                content,
                ...(color && { color })
            }
        })

        success(`Updated note with id ${note.id}`)

        return {
            message: "Note updated successfully",
            success: true,
            data: note as Note
        }

    } catch (e) {
        error(`Error updating note with id ${data.id}`, e)
        return {
            message: "Something went wrong",
            success: false
        }
    }
}

export const deleteNote = async (data: DeleteNote): Promise<SingleNoteResponse> => {
    try {
        const { id } = data
        if (!id) return {
            message: "Id is required",
            success: false
        }

        info(`Deleting note with id ${id}`)

        const note = await prisma.note.delete({
            where: {
                id
            }
        })

        success(`Deleted note with id ${note.id}`)

        return {
            message: "Note deleted successfully",
            success: true,
            data: note as Note
        }
    } catch (e) {
        error(`Error deleting note with id ${data.id}`, e)
        return {
            message: "Something went wrong",
            success: false
        }
    }
}

export const getNotes = async (data: GetNotes = {}): Promise<ActionResponse> => {
    try {
        const { searchQuery } = data
        info("Fetching notes", searchQuery);

        const where = searchQuery
            ? {
                OR: [
                    { title: { contains: searchQuery, mode: 'insensitive' as const } },
                    { content: { contains: searchQuery, mode: 'insensitive' as const } }
                ]
            }
            : {};

        const notes = await prisma.note.findMany({
            where,
            orderBy: { updatedAt: "desc" },
        });

        success("Notes fetched successfully", { count: notes.length });

        return {
            message: "Notes fetched successfully",
            success: true,
            data: notes as Note[],
        };
    } catch (e) {
        error("Error fetching notes", e);
        return {
            message: "Something went wrong",
            success: false,
        };
    }
};

export const getNote = async (id: string): Promise<SingleNoteResponse> => {
    try {
        if (!id) return {
            message: "Id is required",
            success: false
        }

        info(`Fetching note with id ${id}`)

        const note = await prisma.note.findUnique({
            where: {
                id
            }
        })

        if (!note) return {
            message: "Note not found",
            success: false
        }

        success(`Fetched note with id ${note.id}`)

        return {
            message: "Note fetched successfully",
            success: true,
            data: note as Note
        }
    } catch (e) {
        error(`Error fetching note with id ${id}`, e)
        return {
            message: "Something went wrong",
            success: false
        }
    }
}