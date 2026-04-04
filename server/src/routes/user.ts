import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import type { Bindings, Variables } from '../types'

const user = new Hono<{ Bindings: Bindings, Variables: Variables }>()

user.get('/me', async (c) => {
  const user = c.get('user')
  
  // Достаем свежие данные из базы (баланс мог измениться)
  const userData = await c.env.DB.prepare('SELECT id, name, email, balance, api_key, created_at FROM users WHERE id = ?')
    .bind(user.id)
    .first()

  if (!userData) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json({ user: userData })
})

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
})

user.patch('/me', zValidator('json', updateProfileSchema), async (c) => {
  const user = c.get('user')
  const { name, email } = c.req.valid('json')

  const updates: string[] = []
  const values: any[] = []

  if (name) {
    updates.push('name = ?')
    values.push(name)
  }
  if (email) {
    updates.push('email = ?')
    values.push(email)
  }

  if (updates.length === 0) {
    return c.json({ error: 'Nothing to update' }, 400)
  }

  values.push(user.id) // Для WHERE

  try {
    await c.env.DB.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...values)
      .run()

    return c.json({ success: true })
  } catch (err: any) {
    return c.json({ error: 'Update failed', details: err.message }, 500)
  }
})

// Транзакции и логи использования
user.get('/transactions', async (c) => {
    const user = c.get('user')
    const transactions = await c.env.DB.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC')
        .bind(user.id)
        .all()
    return c.json(transactions.results)
})

user.get('/usage', async (c) => {
    const user = c.get('user')
    const usage = await c.env.DB.prepare(`
        SELECT u.id, u.service_id, u.amount, u.cost, u.created_at, s.name as service_name
        FROM usage_logs u
        JOIN services s ON u.service_id = s.id
        WHERE u.user_id = ?
        ORDER BY u.created_at DESC
        LIMIT 50
    `).bind(user.id).all()
    return c.json(usage.results)
})

export default user
