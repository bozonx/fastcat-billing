import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { sign } from 'hono/jwt'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import type { Bindings, Variables } from '../types'

const auth = new Hono<{ Bindings: Bindings, Variables: Variables }>()

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

auth.post('/register', zValidator('json', registerSchema), async (c) => {
  const { name, email, password } = c.req.valid('json')
  
  // Проверка существующего пользователя
  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
  if (existing) {
    return c.json({ error: 'User already exists' }, 400)
  }

  const userId = uuidv4()
  const apiKey = `fc_${uuidv4().replace(/-/g, '')}`
  const passwordHash = await bcrypt.hash(password, 10)

  try {
    await c.env.DB.prepare(
      'INSERT INTO users (id, name, email, password_hash, api_key, balance) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(userId, name, email, passwordHash, apiKey, 10.0).run() // Даем 10$ за регистрацию для тестов

    const token = await sign({ id: userId, email }, c.env.JWT_SECRET)
    
    return c.json({ 
      success: true, 
      token,
      user: { id: userId, name, email, balance: 10.0, api_key: apiKey } 
    })
  } catch (err: any) {
    return c.json({ error: 'Registration failed', details: err.message }, 500)
  }
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

auth.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json')
  
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first<{ id: string; name: string; email: string; password_hash: string; api_key: string; balance: number }>()

  if (!user || !user.password_hash) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  const token = await sign({ id: user.id, email: user.email }, c.env.JWT_SECRET)
  
  return c.json({ 
    success: true, 
    token,
    user: { id: user.id, name: user.name, email: user.email, balance: user.balance, api_key: user.api_key } 
  })
})

auth.post('/logout', (c) => {
  return c.json({ success: true })
})

export default auth
