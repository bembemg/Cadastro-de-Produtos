require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(express.json());
app.use(cors());

// Local
// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//     ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
// });

// Deploy
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function initializeDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(24) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            available BOOLEAN DEFAULT TRUE
            )
            `)
        console.log('Tabela criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar tabela products:', error);
    }
}

initializeDB();

app.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

app.post('/products', async (req, res) => {
    const { name, description, price, available } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO products (name, description, price, available) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, price, available]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, available } = req.body;
    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, description = $2, price = $3, available = $4 WHERE id = $5 RETURNING *',
            [name, description, price, available, id]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Produto não encontrado' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
});

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Produto não encontrado' });
        } else {
            res.json({ message: 'Produto excluído com sucesso' });
        }
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).json({ error: 'Erro ao excluir produto' });
    }
});

app.listen(3001, '0.0.0.0', () => {
    console.log('Servidor rodando na porta 3001');
})