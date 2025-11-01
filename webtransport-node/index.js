// index.js
import { Http3Server } from '@fails-components/webtransport';
import fs from 'fs';
import { categories, products, reviews } from './db.js';

const port = 4003;

const server = new Http3Server({
    port,
    host: '0.0.0.0',
    secret: 'my-secret-key',
    cert: fs.readFileSync('./certs/cert.pem'),
    privKey: fs.readFileSync('./certs/key.pem'),
});

server.startServer();

console.log(`✅ Servidor WebTransport rodando em https://localhost:${port}`);

// Aguarda por sessões - CORREÇÃO: remover o .then()
(async () => {
    const sessionStream = await server.sessionStream('/');

    for await (const session of sessionStream) {
        console.log('✅ Nova sessão conectada!');
        handleSession(session);
    }
})();

async function handleSession(session) {
    try {
        const streams = await session.incomingBidirectionalStreams();

        for await (const stream of streams) {
            console.log('📨 Novo stream recebido');
            handleStream(stream);
        }
    } catch (error) {
        console.error('Erro na sessão:', error);
    }
}

async function handleStream(stream) {
    const reader = stream.readable.getReader();
    const writer = stream.writable.getWriter();

    try {
        const { value } = await reader.read();
        const message = JSON.parse(new TextDecoder().decode(value));

        console.log('📩 Mensagem recebida:', message);

        let response;

        switch (message.action) {
            case 'getProduct': {
                const product = products.find(p => p.id === message.payload.id);
                if (product) {
                    const category = categories.find(c => c.id === product.categoryId);
                    const productReviews = reviews.filter(r => r.productId === product.id);
                    response = { ...product, category, reviews: productReviews };
                } else {
                    response = { error: 'Produto não encontrado' };
                }
                break;
            }
            case 'getAllProducts': {
                response = products.map(p => ({
                    ...p,
                    category: categories.find(c => c.id === p.categoryId),
                    reviews: reviews.filter(r => r.productId === p.id)
                }));
                break;
            }
            case 'createProduct': {
                const { name, price, categoryId } = message.payload;
                const newProduct = {
                    id: `prod-${Date.now()}`,
                    name,
                    price,
                    categoryId
                };
                products.push(newProduct);
                response = newProduct;
                break;
            }
            default:
                response = { error: 'Ação desconhecida' };
        }

        console.log('📤 Enviando resposta:', response);
        await writer.write(new TextEncoder().encode(JSON.stringify(response)));

    } catch (error) {
        console.error('Erro ao processar stream:', error);
        await writer.write(new TextEncoder().encode(JSON.stringify({ error: error.message })));
    } finally {
        try {
            await writer.close();
            reader.releaseLock();
        } catch (e) {
            // Ignora erros ao fechar
        }
    }
}