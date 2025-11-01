// resolvers.js
import { categories, products, reviews } from './db.js';

export const resolvers = {
    // --- RESOLVERS PARA QUERIES ---
    Query: {
        // Resolve a query 'product(id: ...)'
        product: (parent, args) => {
            console.log(`Buscando produto com ID: ${args.id}`);
            return products.find(p => p.id === args.id);
        },
        // Resolve a query 'products'
        products: () => {
            console.log('Buscando todos os produtos');
            return products;
        },
    },

    // --- RESOLVERS PARA MUTATIONS ---
    Mutation: {
        // Resolve a mutation 'createProduct(...)'
        createProduct: (parent, args) => {
            const newProduct = {
                id: `prod-${Date.now()}`, // ID simples para o exemplo
                name: args.name,
                price: args.price,
                categoryId: args.categoryId,
                description: args.description || null
            };
            console.log('Criando novo produto:', newProduct);
            products.push(newProduct);
            return newProduct;
        }
    },

    // --- RESOLVERS PARA DADOS ANINHADOS (RELACIONAMENTOS) ---
    // Quando uma query pede um campo 'category' dentro de 'Product', esta função é chamada.
    Product: {
        category: (parentProduct) => {
            // 'parentProduct' é o objeto do produto que está sendo processado
            console.log(`Resolvendo categoria para o produto: ${parentProduct.name}`);
            return categories.find(c => c.id === parentProduct.categoryId);
        },
        reviews: (parentProduct) => {
            console.log(`Resolvendo reviews para o produto: ${parentProduct.name}`);
            return reviews.filter(r => r.productId === parentProduct.id);
        }
    }
};