"use server"

import { error, info, success } from "@/lib/logger"
import { prisma } from "@/lib/prisma"
import { ActionResponse, CreateTodo , DeleteTodo, GetTodos, SingleTodoResponse, Todo, UpdateTodo } from "@/types/todo"


export const createTodo = async (data: CreateTodo) : Promise<SingleTodoResponse> => {
    try{
        const {title, description} = data

        if(!title || !description) return {
            message: "Title and description are required",
            success: false
        }

        info(`Creating todo with title ${title} and description ${description}`)

        const todo = await prisma.todo.create({
            data: {
                title,
                description
            }
        })


        success(`Created todo with id ${todo.id}`)

        return {
            message: "Todo created successfully",
            success: true,
            data: { ...todo, description: todo.description ?? undefined } as Todo
        }
        
    }catch(e){
        error(`Error creating todo ${data.title}`, e)
        return {
            message: "Something went wrong",
            success: false
        }
    }
}

export const updateTodo = async (data: UpdateTodo) : Promise<SingleTodoResponse> => {
    try{
        const {title, description} = data
        if(!title || !description || !data.id) return {
            message: "Title and description are required",
            success: false
        }

        info(`Updating todo with id ${data.id}`)
        info("Updating data", data)

        const todo = await prisma.todo.update({
            where: {
                id: data.id
            },
            data: {
                title,
                description
            }
        })

        success(`Updated todo with id ${todo.id}`)

        return {
            message: "Todo updated successfully",
            success: true,
            data: { ...todo, description: todo.description ?? undefined } as Todo
        }
        
    }catch(e){
        error(`Error updating todo with id ${data.id}`, e)
        return {
            message: "Something went wrong",
            success: false
        }
    }
}    

export const toggleTodo = async (id: string) : Promise<SingleTodoResponse> => {
    try{
        info(`Toggling todo with id ${id}`)
        const todo = await prisma.todo.findUnique({
            where: {
                id
            }
        })

        if(!todo) return {
            message: "Todo not found",
            success: false
        }
        const status = todo.completed
        info("Found todo to toggle test 1", todo)
        
        info(`Toggling todo with id ${id} to ${!status}`)
        await prisma.todo.update({
            where: {
                id
            },
            data: {
                completed: !status
            }
        })
        const todoUpdated = await prisma.todo.findUnique({
            where: {
                id
            }
        })
        info("Found todo to toggle test 2", todoUpdated)
        success(`Toggled todo with id ${id} to ${!status}`)
        return {
            message: "Todo toggled successfully",
            success: true,
            data : todoUpdated ? { ...todoUpdated, description: todoUpdated.description ?? undefined } as Todo : undefined
        }
    }catch(e){
        error("Error toggling todo", e)
        return {
            message: "Something went wrong",
            success: false
    }
    }
}

export const deleteTodo = async (data:DeleteTodo) : Promise<SingleTodoResponse> => {
    try{
        const {id} = data
        if(!id) return {
            message: "Id is required",
            success: false
        }

        info(`Deleting todo with id ${id}`)

        const todo = await prisma.todo.delete({
            where: {
                id
            }
        })

        success(`Deleted todo with id ${todo.id}`)

        return {
            message: "Todo deleted successfully",
            success: true,
            data: { ...todo, description: todo.description ?? undefined } as Todo
        }
    }catch(e){
        error(`Error deleting todo with id ${data.id}`, e)
        return {
            message: "Something went wrong",
            success: false
        }
    }
}


export const getTodos = async (data:GetTodos={status:"all"}): Promise<ActionResponse> => {
  try {
    const {status} = data
    info("Fetching todos", status);
    const where =
      status === "finished"
        ? { completed: true }
        : status === "unfinished"
        ? { completed: false }
        : {}; 

    const todos = await prisma.todo.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    success("Todos fetched successfully", { count: todos.length });

    return {
      message: "Todos fetched successfully",
      success: true,
      data: todos.map(t => ({ ...t, description: t.description ?? undefined })) as Todo[],
    };
  } catch (e) {
    error("Error fetching todos", e);
    return {
      message: "Something went wrong",
      success: false,
    };
  }
};

