package com.benchmark.graphql;

import java.math.BigDecimal;

public record Produto(
        Integer id,
        String nome,
        String descricao,
        BigDecimal preco,
        int estoque
) {}
