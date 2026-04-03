import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { v4 as uuidv4 } from 'uuid'
import type { Bindings, Variables } from './types'

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Middleware для проверки API ключа юзера
app.use('*', async (c, next) => {
  if (c.req.path === '/' || c.req.path === '/health') return await next()
  
  const apiKey = c.req.header('X-API-Key')
  if (!apiKey) {
    return c.json({ error: 'Missing API Key' }, 401)
  }

  // Проверка ключа в БД (D1)
  const user = await c.env.DB.prepare('SELECT id, balance FROM users WHERE api_key = ?')
    .bind(apiKey)
    .first<{ id: string; balance: number }>()

  if (!user) {
    return c.json({ error: 'Invalid API Key' }, 401)
  }

  c.set('user', user)
  await next()
})

app.get('/', (c) => {
  return c.text('Fastcat Billing API is running')
})

// Получение текущего баланса
app.get('/balance', async (c) => {
  const user = c.get('user')
  return c.json({ balance: user.balance })
})

// Фиксация использования ресурса
const usageSchema = z.object({
  service_id: z.string(),
  amount: z.number().positive(),
  metadata: z.record(z.any()).optional(),
})

app.post('/usage', zValidator('json', usageSchema), async (c) => {
  const user = c.get('user')
  const { service_id, amount, metadata } = c.req.valid('json')

  // Получаем стоимость услуги
  const service = await c.env.DB.prepare('SELECT cost_per_unit FROM services WHERE id = ?')
    .bind(service_id)
    .first<{ cost_per_unit: number }>()

  if (!service) {
    return c.json({ error: 'Service not found' }, 404)
  }

  const cost = service.cost_per_unit * amount

  // Проверка баланса
  if (user.balance < cost) {
    return c.json({ error: 'Insufficient balance' }, 402)
  }

  // Транзакция: обновление баланса и лог использования
  const usageId = uuidv4()
  const transId = uuidv4()

  try {
    // В D1 batch принимает массив PreparedStatements
    await c.env.DB.batch([
      c.env.DB.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').bind(cost, user.id),
      c.env.DB.prepare('INSERT INTO usage_logs (id, user_id, service_id, amount, cost, metadata) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(usageId, user.id, service_id, amount, cost, JSON.stringify(metadata || {})),
      c.env.DB.prepare('INSERT INTO transactions (id, user_id, amount, description, type) VALUES (?, ?, ?, ?, ?)')
        .bind(transId, user.id, -cost, `Usage: ${service_id}`, 'spend')
    ])

    return c.json({ 
      success: true, 
      cost, 
      remaining_balance: user.balance - cost,
      usage_id: usageId 
    })
  } catch (err: any) {
    console.error('Billing error:', err)
    return c.json({ error: 'Billing transaction failed', details: err.message }, 500)
  }
})

export default app
