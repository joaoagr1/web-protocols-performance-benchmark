// db.js

const categories = [
    { id: 'cat-1', name: 'Eletrônicos' },
    { id: 'cat-2', name: 'Livros' },
];

const products = [
    { id: 'prod-1', name: 'Notebook Gamer', description: 'Notebook de alta performance.', price: 5999.90, categoryId: 'cat-1' },
    { id: 'prod-2', name: 'GraphQL para Iniciantes', description: 'Aprenda tudo sobre GraphQL.', price: 89.90, categoryId: 'cat-2' },
    { id: 'prod-3', name: 'Monitor 4K', description: 'Monitor com resolução Ultra HD.', price: 2100.00, categoryId: 'cat-1' },
];

const reviews = [
    { id: 'rev-1', rating: 5, text: 'Produto excelente!', productId: 'prod-1' },
    { id: 'rev-2', rating: 4, text: 'Bom custo-benefício.', productId: 'prod-1' },
    { id: 'rev-3', rating: 5, text: 'Livro muito didático.', productId: 'prod-2' },
];

export { categories, products, reviews };