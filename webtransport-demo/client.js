import { WebTransportPonyfill } from "@fails-components/webtransport-ponyfill-websocket";

const WebTransport = WebTransportPonyfill;
const url = 'wss://localhost:4433/echo';

async function runClient() {
    let transport = null;

    try {
        console.log('🔄 Tentando conectar ao servidor WebTransport (via WebSocket Ponyfill)...');

        transport = new WebTransport(url, {
            node: {
                rejectUnauthorized: false
            }
        });

        await transport.ready;
        console.log('✅ Conectado com sucesso ao servidor WebTransport (via Ponyfill)!');

        await testDatagram(transport, 'Datagram Teste do Node.js');
        await testBidirectionalStream(transport, 'Stream Bidirecional Teste do Node.js');
        startDatagramListener(transport);

        await new Promise(resolve => setTimeout(resolve, 500));

        transport.close();
        console.log('🔌 Conexão fechada.');

    } catch (error) {
        console.error(`❌ Erro Fatal no Cliente: ${error.message}`);
        if (transport) {
            console.error(`Status da Conexão: ${transport.state}`);
        }
    }
}

async function testDatagram(transport, message) {
    try {
        console.log(`\n📦 Enviando Datagram: "${message}"`);
        const writer = transport.datagrams.writable.getWriter();
        await writer.write(new TextEncoder().encode(message));
        writer.releaseLock();
        console.log('Datagram enviado com sucesso. Aguardando ACK...');
    } catch (error) {
        console.error(`❌ Erro ao enviar datagram: ${error.message}`);
    }
}

async function testBidirectionalStream(transport, message) {
    try {
        console.log(`\n📤 Enviando via Stream Bidirecional: "${message}"`);
        const stream = await transport.createBidirectionalStream();
        const writer = stream.writable.getWriter();
        const reader = stream.readable.getReader();

        await writer.write(new TextEncoder().encode(message));
        await writer.close();
        writer.releaseLock();

        const { value, done } = await reader.read();
        if (!done) {
            const response = new TextDecoder().decode(value);
            console.log(`📥 Resposta (Echo) recebida: "${response}"`);
        }
        reader.releaseLock();
    } catch (error) {
        console.error(`❌ Erro ao enviar/receber stream: ${error.message}`);
    }
}

async function startDatagramListener(transport) {
    try {
        const reader = transport.datagrams.readable.getReader();
        console.log('\n👂 Iniciando listener de Datagrams...');

        while (true) {
            const { value, done } = await reader.read();

            if (done) break;

            const message = new TextDecoder().decode(value);
            console.log(`📬 Datagram recebido: "${message}"`);
        }
    } catch (error) {
        if (transport && transport.state === 'connected') {
            console.error(`❌ Erro ao receber datagram: ${error.message}`);
        }
    }
}

runClient();
