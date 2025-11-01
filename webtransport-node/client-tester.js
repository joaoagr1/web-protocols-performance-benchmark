// client-tester.js

import { WebTransport } from '@fails-components/webtransport';

const url = 'https://localhost:4003';

console.log(`Tentando conectar ao servidor WebTransport em ${url}`);

async function runClient() {
    try {
        const transport = new WebTransport(url, {
            serverCertificateHashes: [{
                algorithm: "sha-256",
                value: new Uint8Array(32).fill(0) // Para desenvolvimento, aceita qualquer cert
            }]
        });

        await transport.ready;
        console.log('✅ Conexão WebTransport estabelecida com sucesso!');

        async function request(action, payload) {
            console.log(`\n=> Enviando Ação: ${action}`, payload || '');

            const stream = await transport.createBidirectionalStream();
            const writer = stream.writable.getWriter();
            const reader = stream.readable.getReader();

            await writer.write(new TextEncoder().encode(JSON.stringify({ action, payload })));
            await writer.close();

            const { value } = await reader.read();
            const response = JSON.parse(new TextDecoder().decode(value));
            console.log('<= Resposta Recebida:', response);

            reader.releaseLock();

            return response;
        }

        await request('getProduct', { id: 'prod-1' });
        await request('getAllProducts');
        await request('createProduct', { name: 'SSD 1TB', price: 450.00, categoryId: 'cat-1' });
        await request('getProduct', { id: 'prod-999' });

        console.log('\nTodos os testes foram concluídos. Fechando a conexão.');
        transport.close();
    } catch (error) {
        console.error('❌ Erro:', error.message);
        console.error('Stack:', error.stack);
    }
}

runClient();