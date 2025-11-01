// server.js
const express = require('express');
const soap = require('soap');
const fs = require('fs');

// 1. A lógica de negócio do nosso serviço
// A estrutura do objeto deve seguir o WSDL: Service > Port > Operation
const productService = {
    ProductsService: {
        ProductsPort: {
            // Esta é a operação que definimos no WSDL
            GetProduct: function(args) {
                console.log('SOAP Request Recebido com args:', args);

                const productId = args.id;

                // Simula a busca no banco de dados
                if (productId === 123) {
                    return {
                        id: 123,
                        name: 'Produto Exemplo SOAP',
                        price: 99.99
                    };
                } else {
                    // SOAP lida com erros através de "Faults"
                    throw new Error('Produto não encontrado');
                }
            }
        }
    }
};

// 2. Lê o arquivo WSDL
const wsdl = fs.readFileSync('products.wsdl', 'utf8');

// 3. Cria o servidor Express
const app = express();
const port = 8000;

app.listen(port, function() {
    // 4. Anexa o servidor SOAP ao Express
    // A biblioteca 'soap' vai escutar no endpoint '/products' e lidar com as requisições SOAP
    soap.listen(app, '/products', productService, wsdl, function() {
        console.log(`Servidor Express rodando na porta ${port}`);
        console.log(`Endpoint SOAP disponível em http://localhost:${port}/products?wsdl`);
    });
});