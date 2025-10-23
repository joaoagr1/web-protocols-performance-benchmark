package com.benchmark.http;

import org.springframework.stereotype.Repository;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Repository
public class ProdutoRepository {

    private final Map<Integer, Produto> catalogo = new ConcurrentHashMap<>();
    private final AtomicInteger idGenerator = new AtomicInteger(0);

    @PostConstruct
    private void initData() {
        save(new Produto(null, "Notebook Pro", "Notebook de última geração", new BigDecimal("7500.99"), 10));
        save(new Produto(null, "Mouse Sem Fio", "Mouse ergonômico", new BigDecimal("150.50"), 100));
    }

    public List<Produto> findAll() {
        return new ArrayList<>(catalogo.values());
    }

    public Optional<Produto> findById(Integer id) {
        return Optional.ofNullable(catalogo.get(id));
    }

    public Produto save(Produto produto) {
        if (produto.id() == null) {
            int novoId = idGenerator.incrementAndGet();
            produto = new Produto(novoId, produto.nome(), produto.descricao(), produto.preco(), produto.estoque());
        }
        catalogo.put(produto.id(), produto);
        return produto;
    }
}