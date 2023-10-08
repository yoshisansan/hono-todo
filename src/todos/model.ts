// import googleAPI from 'googleapis';
import { z } from 'zod'

export const PREFIX = 'v1:todo:'

// export

export const getTodos = async (KV: KVNamespace): Promise<Todo[]> => {
  const list = await KV.list({ prefix: PREFIX })
  const todos: Todo[] = []

  for (const key of list.keys) {
    const value = await KV.get<Todo>(key.name, 'json')
    if (value) {
      todos.push(value)
    }
  }

  return todos
}

export const getTodo = (KV: KVNamespace, id: string): Promise<Todo | null> => {
  return KV.get<Todo>(`${PREFIX}${id}`, 'json')
}

export const createTodo = async (
  KV: KVNamespace,
  param: CreateTodo
): Promise<Todo> => {
  const id = crypto.randomUUID()
  const newTodo: Todo = {
    id,
    title: param.title,
    completed: false,
  }
  await KV.put(`${PREFIX}${id}`, JSON.stringify(newTodo))

  return newTodo
}

export const updateTodo = async (
  KV: KVNamespace,
  id: string,
  param: UpdateTodo
): Promise<void> => {
  const todo = await getTodo(KV, id)
  if (!todo) {
    return
  }

  const updateTodo = {
    ...todo,
    ...param,
  }

  await KV.put(`${PREFIX}${id}`, JSON.stringify(updateTodo))
}

export const deleteTodo = (KV: KVNamespace, id: string) => {
  return KV.delete(`${PREFIX}${id}`)
}

export const TodoTitleSchema = z.object({
  title: z.string().refine(value => value.trim() !== '', {
    message: 'Title cannot be blank',
  }),
})

export const TodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
})

export const TodoSchemaArr = z.array(TodoSchema)

export const CreateTodoSchema = z.object({
  title: z.string(),
})

export const UpdateTodoSchema = z.object({
  title: z.string().optional(),
  completed: z.boolean().optional(),
})
export const DeleteTodoSchema = z.object({
  id: z.string(),
})

export type Todo = z.infer<typeof TodoSchema>
export type CreateTodo = z.infer<typeof CreateTodoSchema>
export type UpdateTodo = z.infer<typeof UpdateTodoSchema>
