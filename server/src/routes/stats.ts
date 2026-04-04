import { Hono } from 'hono'
import type { Bindings, Variables } from '../types'

const stats = new Hono<{ Bindings: Bindings, Variables: Variables }>()

stats.get('/dashboard', async (c) => {
  const user = c.get('user')
  
  // 1. Текущий баланс (уже есть в user, но возьмем свежий)
  const freshUser = await c.env.DB.prepare('SELECT balance FROM users WHERE id = ?')
    .bind(user.id)
    .first<{ balance: number }>()

  // 2. Использование токенов (сумма amount для llm)
  const llmUsage = await c.env.DB.prepare('SELECT SUM(amount) as total FROM usage_logs WHERE user_id = ? AND service_id LIKE "llm%"')
    .bind(user.id)
    .first<{ total: number }>()

  // 3. Активные сервисы (количество уникальных service_id за последние 30 дней)
  const activeServices = await c.env.DB.prepare('SELECT COUNT(DISTINCT service_id) as count FROM usage_logs WHERE user_id = ? AND created_at > date("now", "-30 days")')
    .bind(user.id)
    .first<{ count: number }>()

  // 4. Последние транзакции
  const recentTransactions = await c.env.DB.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 5')
    .bind(user.id)
    .all()

  return c.json({
    balance: freshUser?.balance || 0,
    llm_tokens: llmUsage?.total || 0,
    active_services_count: activeServices?.count || 0,
    recent_transactions: recentTransactions.results
  })
})

export default stats
