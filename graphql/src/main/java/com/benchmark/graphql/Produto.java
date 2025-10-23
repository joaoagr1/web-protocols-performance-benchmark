package com.benchmark.graphql;

import java.math.BigDecimal;

// Usando record para um DTO imutável e conciso
public record Produto(
        Integer id,
        String nome,
        String descricao,
        BigDecimal preco,
        int estoque
) {}