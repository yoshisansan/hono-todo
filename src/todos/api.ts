import { Hono } from 'hono'
import type { Context } from 'hono'
import { validator } from 'hono/validator'
import { Bindings } from '../bindings'

import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  TodoTitleSchema,
  updateTodo,
  UpdateTodoSchema,
  DeleteTodoSchema,
} from './model'

// let todoList = [
//   { id: '1', title: 'Learning Hono', completed: false },
//   { id: '2', title: 'Watch the movie', completed: true },
//   { id: '3', title: 'Buy milk', completed: false },
// ]

const todos = new Hono<{ Bindings: Bindings }>()

todos.get('/', async (c: Context) => {
  const todos = await getTodos(c.env.HONO_TODO)
  return c.json(todos)
})

todos.post(
  '/',
  validator('json', (value: Record<string, string>, c) => {
    const parsed = TodoTitleSchema.safeParse(value)
    if (!parsed.success) {
      return c.text('Invalid!', 401)
    }

    return parsed.data
  }),
  async c => {
    const param = await c.req.json<{ title: string }>()
    const newTodo = await createTodo(c.env.HONO_TODO, param)

    return c.json(newTodo, 201)
  }
)

todos.put(
  '/:id',
  validator('json', (value: Record<string, string>, c) => {
    const parsed = UpdateTodoSchema.safeParse(value)
    if (!parsed.success) {
      return c.text('Invalid!', 401)
    }

    return parsed.data
  }),
  async (c: Context) => {
    const id = c.req.param('id')
    const todo = await getTodo(c.env.HONO_TODO, id)
    if (!todo) {
      return c.json({ message: 'not found' }, 404)
    }

    const param = await c.req.json<{ title?: string; completed?: boolean }>()
    await updateTodo(c.env.HONO_TODO, id, param)

    return new Response(null, { status: 204 })
  }
)

todos.delete(
  '/:id',
  validator('param', (value: Record<string, string>, c) => {
    const parsed = DeleteTodoSchema.safeParse(value)
    if (!parsed.success) {
      return c.text('Invalid!', 401)
    }

    return parsed.data
  }),
  async c => {
    const id = c.req.param('id')
    const todo = await getTodo(c.env.HONO_TODO, id)
    if (!todo) {
      return c.json({ message: 'not found' }, 404)
    }

    await deleteTodo(c.env.HONO_TODO, id)
    return new Response(null, { status: 204 })
  }
)

export { todos }
