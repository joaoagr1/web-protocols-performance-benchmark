// index.js

import express from 'express';
import cors from 'cors';
import { categories, products, reviews } from './db.js';

const app = express();
const port = 4002; // Usando uma porta diferente para não conflitar com a API GraphQL

// Middlewares essenciais
app.use(cors());
app.use(express.json()); // NECESSÁRIO para ler o corpo (body) de requisições POST

// --- ENDPOINTS PARA O BENCHMARK ---

/**
 * Cenário de Teste: Consulta Simples
 * Leitura de um único recurso.
 * MÉTODO: GET
 * URL: /products/:id
 */
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    const product = products.find(p => p.id === id);

    if (product) {
        // Para uma comparação justa, vamos incluir os dados aninhados aqui também
        const category = categories.find(c => c.id === product.categoryId);
        const productReviews = reviews.filter(r => r.productId === product.id);

        res.json({
            ...product,
            category,
            reviews: productReviews
        });
    } else {
        res.status(404).json({ error: 'Produto não encontrado' });
    }
});

/**
 * Cenário de Teste: Consulta Complexa (Demonstrando a verbosidade do REST)
 * Leitura de uma lista de recursos aninhados. Em REST, isso geralmente
 * exige que o servidor faça o "join" dos dados manualmente.
 * MÉTODO: GET
 * URL: /products/detailed
 */
app.get('/products/detailed', (req, res) => {
    const detailedProducts = products.map(product => {
        const category = categories.find(c => c.id === product.categoryId);
        const productReviews = reviews.filter(r => r.productId === product.id);
        return {
            ...product,
            category,
            reviews: productReviews
        };
    });
    res.json(detailedProducts);
});

// Endpoint REST padrão (sem dados aninhados, para demonstrar o problema de N+1)
app.get('/products', (req, res) => {
    res.json(products);
});

/**
 * Cenário de Teste: Operação Transacional
 * Escrita de dados.
 * MÉTODO: POST
 * URL: /products
 */
app.post('/products', (req, res) => {
    const { name, price, categoryId } = req.body;

    if (!name || !price || !categoryId) {
        return res.status(400).json({ error: 'Os campos name, price e categoryId são obrigatórios.' });
    }

    const newProduct = {
        id: `prod-${Date.now()}`,
        name,
        price,
        categoryId,
        description: req.body.description || null
    };

    products.push(newProduct);

    // É uma boa prática REST retornar o recurso criado com status 201
    res.status(201).json(newProduct);
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`✅ Protótipo REST pronto para benchmark em http://localhost:${port}`);
});