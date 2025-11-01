import WT from "@fails-components/webtransport-ponyfill-websocket";
import fs from 'fs';
import https from 'https';

// Tenta obter o construtor WebTransportServer.
// Isso cobre (propriedade nomeada) ou (o próprio objeto WT é o construtor).
const WebTransportServer = WT.WebTransportServer || WT;

const certPath = "./cert.pem";
const keyPath = "./key.pem";

const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};

const httpsServer = https.createServer(options);
const port = 4433;

const server = new WebTransportServer({
    server: httpsServer,
    path: "/echo"
});

httpsServer.listen(port, "0.0.0.0", () => {
    console.log(`⚡️ Servidor HTTPS/WSS está ouvindo em https://localhost:${port}`);
    console.log(`⚡️ WebTransport (Ponyfill) está ouvindo no path /echo`);
});

(async () => {
    const stream = await server.sessionStream('/echo');
    const sessionReader = stream.getReader();

    while (true) {
        const { done, value: session } = await sessionReader.read();

        if (done) {
            break;
        }

        console.log("-----------------------------------------");
        console.log(`[Nova Sessão] ID: ${session.sessionId || 'N/A'}`);

        (async () => {
            const incomingBidirectionalStreams = session.incomingBidirectionalStreams;
            const streamReader = incomingBidirectionalStreams.getReader();

            while (true) {
                const { done, value: stream } = await streamReader.read();

                if (done) break;

                console.log(`[Stream Bidirecional] Novo Stream Aberto`);

                (async () => {
                    const reader = stream.readable.getReader();
                    const writer = stream.writable.getWriter();

                    try {
                        while (true) {
                            const { value, done } = await reader.read();

                            if (done) {
                                console.log("[Stream Bidirecional] Stream encerrado pelo cliente.");
                                break;
                            }

                            const receivedData = new TextDecoder().decode(value);
                            console.log(`[Stream Bidirecional - Recebido]: ${receivedData}`);

                            const response = `Echo: ${receivedData}`;
                            await writer.write(new TextEncoder().encode(response));
                            console.log(`[Stream Bidirecional - Enviado]: ${response}`);
                        }
                    } catch (error) {
                        console.error("[Stream Error]:", error);
                    } finally {
                        try {
                            reader.releaseLock();
                            writer.releaseLock();
                        } catch (e) {
                        }
                    }
                })();
            }
        })();

        (async () => {
            const datagrams = session.datagrams;
            const reader = datagrams.readable.getReader();

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const receivedData = new TextDecoder().decode(value);
                console.log(`[Datagram - Recebido]: ${receivedData}`);

                const ackMessage = `Datagram Ack: ${receivedData.substring(0, 10)}...`;
                const writer = datagrams.writable.getWriter();
                await writer.write(new TextEncoder().encode(ackMessage));
                writer.releaseLock();
                console.log(`[Datagram - Enviado ACK]: ${ackMessage}`);
            }
        })();

        session.closed.then(() => {
            console.log(`[Sessão Encerrada] ID: ${session.sessionId || 'N/A'}`);
            console.log("-----------------------------------------");
        }).catch((error) => {
            console.error(`[Sessão com Erro]: ${error.message}`);
        });
    }
})();
