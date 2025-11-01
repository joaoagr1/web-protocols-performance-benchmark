// schema.js

export const typeDefs = `#graphql
    # Representa uma avaliação de um produto
    type Review {
        id: ID!
        rating: Int!
        text: String
    }

    # Representa a categoria de um produto
    type Category {
        id: ID!
        name: String!
    }

    # Representa um produto em nosso sistema
    type Product {
        id: ID!
        name: String!
        description: String
        price: Float!
        # Relação aninhada: um produto tem uma categoria
        category: Category!
        # Relação aninhada: um produto pode ter várias reviews
        reviews: [Review!]
    }

    # Ponto de entrada para todas as operações de LEITURA (GET)
    type Query {
        """
        Cenário de Teste: Consulta Simples
        Busca um único recurso pelo seu ID.
        """
        product(id: ID!): Product

        """
        Cenário de Teste: Consulta Complexa (Over-fetching)
        Busca uma lista de todos os produtos.
        """
        products: [Product!]!
    }

    # Ponto de entrada para todas as operações de ESCRITA (POST/Mutation)
    type Mutation {
        """
        Cenário de Teste: Operação Transacional
        Cria um novo produto no sistema.
        """
        createProduct(name: String!, price: Float!, categoryId: ID!): Product!
    }
`;