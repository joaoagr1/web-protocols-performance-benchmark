package com.benchmark.graphql;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Controller
public class ProdutoController {


    private final List<Produto> catalogo = new ArrayList<>();

    private final AtomicInteger idGenerator = new AtomicInteger();


    public ProdutoController() {
        catalogo.add(new Produto(idGenerator.incrementAndGet(), "Notebook Pro", "Notebook de última geração", new BigDecimal("7500.99"), 10));
        catalogo.add(new Produto(idGenerator.incrementAndGet(), "Mouse Sem Fio", "Mouse ergonômico", new BigDecimal("150.50"), 100));
    }


    @QueryMapping
    public List<Produto> todosProdutos() {
        System.out.println("Buscando todos os produtos...");
        return catalogo;
    }



    @QueryMapping
    public Produto produtoPorId(@Argument Integer id) {
        System.out.println("Buscando produto por ID: " + id);
        return catalogo.stream()
                .filter(p -> p.id().equals(id))
                .findFirst()
                .orElse(null);
    }

    @MutationMapping
    public Produto adicionarProduto(@Argument ProdutoInput produto) {

        var novoProduto = new Produto(
                idGenerator.incrementAndGet(),
                produto.nome(),
                produto.descricao(),
                produto.preco(),
                produto.estoque()
        );

        catalogo.add(novoProduto);
        System.out.println("Novo produto adicionado: " + novoProduto);
        return novoProduto;
    }

    public record ProdutoInput(String nome, String descricao, BigDecimal preco, int estoque) {}
}
