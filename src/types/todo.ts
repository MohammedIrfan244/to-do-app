

export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTodo {
    title: string;
    description: string;
}

export interface UpdateTodo {
    id: string;
    title: string;
    description: string;
}

export interface DeleteTodo {
    id: string;
}

export interface GetTodos {
    status: string;
}

export interface GetTodo {
    id: string;
}


// action resonse


export interface ActionResponse {
    success: boolean;
    message: string;
    data?: Todo[];
}


export interface SingleTodoResponse {
    success: boolean;
    message: string;
    data?: Todo;
}