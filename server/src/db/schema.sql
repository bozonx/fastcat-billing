-- Таблица пользователей
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    api_key TEXT UNIQUE NOT NULL,
    balance DECIMAL(10, 4) DEFAULT 0.0000,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Таблица сервисов и тарифов (например, cost_per_unit за 1000 токенов или 1 мин)
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    cost_per_unit DECIMAL(10, 4) NOT NULL,
    unit TEXT NOT NULL, -- 'tokens', 'seconds', 'request'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Логи использования ресурсов
CREATE TABLE usage_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    amount DECIMAL(10, 4) NOT NULL,
    cost DECIMAL(10, 4) NOT NULL,
    metadata TEXT, -- JSON метаданные запроса
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Таблица транзакций (пополнение и списание)
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount DECIMAL(10, 4) NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- 'deposit', 'spend', 'refund'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Вставим дефолтные сервисы
INSERT INTO services (id, name, cost_per_unit, unit) VALUES ('llm_gpt4', 'LLM GPT-4', 0.03, '1000 tokens');
INSERT INTO services (id, name, cost_per_unit, unit) VALUES ('stt_whisper', 'Whisper STT', 0.006, 'minute');
INSERT INTO services (id, name, cost_per_unit, unit) VALUES ('img_dalle3', 'DALL-E 3', 0.04, 'image');
