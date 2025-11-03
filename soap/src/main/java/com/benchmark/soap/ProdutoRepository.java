package com.benchmark.soap;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import br.com.seuprojeto.apisoap.generated.Produto;


@Component
public class ProdutoRepository {
    private static final Map<Integer, Produto> catalogo = new HashMap<>();
    private static int idCounter = 0;

    @PostConstruct
    public void initData() {

        Produto p1 = new Produto();
        p1.setId(++idCounter);
        p1.setNome("Notebook Pro");
        p1.setDescricao("Notebook de última geração");
        p1.setPreco(new BigDecimal("7500.99"));
        p1.setEstoque(10);
        catalogo.put(p1.getId(), p1);

        Produto p2 = new Produto();
        p2.setId(++idCounter);
        p2.setNome("Mouse Sem Fio");
        p2.setDescricao("Mouse ergonômico");
        p2.setPreco(new BigDecimal("150.50"));
        p2.setEstoque(100);
        catalogo.put(p2.getId(), p2);
    }

    public Produto findById(int id) {
        return catalogo.get(id);
    }

    public java.util.List<Produto> findAll() {
        return new java.util.ArrayList<>(catalogo.values());
    }

    public Produto save(String nome, String descricao, BigDecimal preco, int estoque) {
        Produto novoProduto = new Produto();
        novoProduto.setId(++idCounter);
        novoProduto.setNome(nome);
        novoProduto.setDescricao(descricao);
        novoProduto.setPreco(preco);
        novoProduto.setEstoque(estoque);
        catalogo.put(novoProduto.getId(), novoProduto);
        return novoProduto;
    }
}
