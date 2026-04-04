import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import type { Bindings, Variables } from './types'

// Импорт роутов
import auth from './routes/auth'
import user from './routes/user'
import ai from './routes/ai'
import stats from './routes/stats'

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// CORS для фронтенда (в проде нужно ограничить)
app.use('*', cors({
  origin: '*', // Для MVP разрешаем всё, в проде лучше NUXT_PUBLIC_BASE_URL
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))

// Глобальный Healthcheck
app.get('/health', (c) => c.json({ status: 'ok', version: 'v1' }))

// Роуты авторизации (без защиты)
app.route('/api/v1/auth', auth)

// Middleware для авторизации
app.use('/api/v1/*', async (c, next) => {
  // Пропускаем auth роуты (они уже обработаны выше отдельным app.route)
  if (c.req.path.startsWith('/api/v1/auth')) return await next()
  
  // 1. Проверка API ключа (для видеоредактора)
  const apiKey = c.req.header('X-API-Key')
  if (apiKey) {
    const userData = await c.env.DB.prepare('SELECT id, email, name, balance, api_key FROM users WHERE api_key = ?')
      .bind(apiKey)
      .first<{ id: string; email: string; name: string; balance: number; api_key: string }>()

    if (userData) {
      c.set('user', userData)
      return await next()
    }
  }

  // 2. Проверка JWT токена (для личного кабинета)
  const authHeader = c.req.header('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      // Используем встроенный jwt.verify (через middleware или напрямую)
      // Для простоты здесь сделаем проверку через jwt middleware "на лету" 
      // или просто вручную через библиотеку hono/jwt:
      const { verify } = await import('hono/jwt')
      const payload = await verify(token, c.env.JWT_SECRET)
      
      if (payload && payload.id) {
         const userData = await c.env.DB.prepare('SELECT id, email, name, balance, api_key FROM users WHERE id = ?')
          .bind(payload.id)
          .first<{ id: string; email: string; name: string; balance: number; api_key: string }>()
          
         if (userData) {
           c.set('user', userData)
           return await next()
         }
      }
    } catch (e) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }
  }

  return c.json({ error: 'Unauthorized: Missing API Key or Bearer Token' }, 401)
})

// Защищенные роуты
app.route('/api/v1/user', user)
app.route('/api/v1/ai', ai)
app.route('/api/v1/stats', stats)

// Старый роуты для обратной совместимости (опционально, но лучше убрать)
app.get('/', (c) => c.text('Fastcat Billing API v1 is running'))

export default app
