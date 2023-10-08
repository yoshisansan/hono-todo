import { Hono } from 'hono'
import { cors } from 'hono/cors'
// import { basicAuth } from 'hono/basic-auth'
import { todos } from './todos/api'

const app = new Hono()

app.use(
  '/api/v1/*', // appのRouteの全てを /api/vi/* から始める
  // basicAuth({ // curl -u test:123 http://127.0.0.1:8787/api/v1/todos
  //   username: "test",
  //   password: "123",
  // }),
  cors({
    origin: '*',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests','Content-Type'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

/** GET '/' = http://127.0.0.1:8787/api/v1/todos */
app.route('/api/v1/todos', todos)

export default app
