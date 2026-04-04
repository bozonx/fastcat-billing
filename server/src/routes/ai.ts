import { Hono } from 'hono'
import { v4 as uuidv4 } from 'uuid'
import type { Bindings, Variables } from '../types'

const ai = new Hono<{ Bindings: Bindings, Variables: Variables }>()

// Middleware для логгирования и баланса (в дополнение к основному)
// Здесь мы уже имеем c.get('user') из глобального middleware

const MARKUP = 1.1 // 10% надбавка

type AIService = 'stt' | 'llm' | 'image'

const processAIRequest = async (c: any, serviceType: AIService, amount: number, metadata: any) => {
  const user = c.get('user')
  
  // Коды сервисов в БД (нужно чтобы они там были)
  const serviceIdMap: Record<AIService, string> = {
    stt: 'stt_whisper',
    llm: 'llm_gpt4',
    image: 'img_dalle3'
  }

  const serviceId = serviceIdMap[serviceType]

  // Получаем базовую стоимость сервиса
  const service = await c.env.DB.prepare('SELECT cost_per_unit FROM services WHERE id = ?')
    .bind(serviceId)
    .first<{ cost_per_unit: number }>()

  if (!service) {
    return c.json({ error: 'Service definition not found' }, 500)
  }

  const baseCost = service.cost_per_unit * amount
  const finalCost = baseCost * MARKUP // Применяем 10% наценку

  if (user.balance < finalCost) {
    return c.json({ error: 'Insufficient balance for this request' }, 402)
  }

  const usageId = uuidv4()
  const transId = uuidv4()

  try {
    // Выполняем транзакцию списания и логирования
    await c.env.DB.batch([
      c.env.DB.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').bind(finalCost, user.id),
      c.env.DB.prepare('INSERT INTO usage_logs (id, user_id, service_id, amount, cost, metadata) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(usageId, user.id, serviceId, amount, finalCost, JSON.stringify({ ...metadata, markup: '10%' })),
      c.env.DB.prepare('INSERT INTO transactions (id, user_id, amount, description, type) VALUES (?, ?, ?, ?, ?)')
        .bind(transId, user.id, -finalCost, `AI Proxy: ${serviceType} request`, 'spend')
    ])

    return { 
      usageId, 
      finalCost, 
      remaining: user.balance - finalCost 
    }
  } catch (err: any) {
    console.error(`AI Proxy error (${serviceType}):`, err)
    throw new Error('Transaction failed')
  }
}

// STT Endpoint
ai.post('/stt', async (c) => {
  // Элемент лога/биллинга: 1 минута обработки для примера
  const duration = 1 
  
  try {
    const res = await processAIRequest(c, 'stt', duration, { provider: 'whisper' })
    
    // Заглушка результата
    return c.json({
      success: true,
      text: "This is a mock transcription result from FastCat AI.",
      billing: res
    })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// LLM Endpoint
ai.post('/llm', async (c) => {
  // Для простоты: 1000 токенов
  const tokens = 1 
  
  try {
    const res = await processAIRequest(c, 'llm', tokens, { model: 'gpt-4' })
    
    return c.json({
      success: true,
      message: "This is a mock LLM response processed with a 10% fee.",
      billing: res
    })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// Image Generation Endpoint
ai.post('/image', async (c) => {
  const count = 1 
  
  try {
    const res = await processAIRequest(c, 'image', count, { size: '1024x1024' })
    
    return c.json({
      success: true,
      image_url: "https://placedog.net/1024/1024", // Заглушка
      billing: res
    })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

export default ai
