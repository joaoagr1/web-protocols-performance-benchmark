package com.benchmark.http;

import java.math.BigDecimal;
public record Produto(
        Integer id,
        String nome,
        String descricao,
        BigDecimal preco,
        int estoque
) {}