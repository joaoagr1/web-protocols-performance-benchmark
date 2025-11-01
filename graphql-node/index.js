// index.js

import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

async function startServer() {
    const app = express();
    const httpServer = http.createServer(app);
    const port = 4001;

    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();

    // 👇 A CORREÇÃO ESTÁ AQUI! GARANTA QUE ESTA SEÇÃO ESTEJA IGUAL 👇
    app.use(
        '/graphql',
        cors(),
        // 1. ESTA LINHA É ESSENCIAL E DEVE VIR PRIMEIRO
        express.json(),
        // 2. O APOLLO SERVER VEM DEPOIS
        expressMiddleware(server)
    );

    await new Promise((resolve) => httpServer.listen({ port }, resolve));
    console.log(`✅ Protótipo GraphQL pronto para benchmark em http://localhost:${port}/graphql`);
}

startServer();