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

    // Simulação de um banco de dados em memória para o protótipo
    private final List<Produto> catalogo = new ArrayList<>();
    // Simulação de uma sequence para IDs auto-incrementais
    private final AtomicInteger idGenerator = new AtomicInteger();

    // Construtor para popular os dados iniciais para teste
    public ProdutoController() {
        catalogo.add(new Produto(idGenerator.incrementAndGet(), "Notebook Pro", "Notebook de última geração", new BigDecimal("7500.99"), 10));
        catalogo.add(new Produto(idGenerator.incrementAndGet(), "Mouse Sem Fio", "Mouse ergonômico", new BigDecimal("150.50"), 100));
    }

    /**
     * Mapeia a query "todosProdutos" do schema.graphqls.
     * O nome do método DEVE ser o mesmo da query.
     */
    @QueryMapping
    public List<Produto> todosProdutos() {
        System.out.println("Buscando todos os produtos...");
        return catalogo;
    }

    /**
     * Mapeia a query "produtoPorId" do schema.graphqls.
     * A anotação @Argument conecta o parâmetro do método com o argumento da query.
     */
    @QueryMapping
    public Produto produtoPorId(@Argument Integer id) {
        System.out.println("Buscando produto por ID: " + id);
        return catalogo.stream()
                .filter(p -> p.id().equals(id))
                .findFirst()
                .orElse(null);
    }

    /**
     * Mapeia a mutation "adicionarProduto" do schema.graphqls.
     * Usamos uma classe interna para representar o Input, alinhada ao schema.
     */
    @MutationMapping
    public Produto adicionarProduto(@Argument ProdutoInput produto) {
        // Cria um novo produto com um novo ID
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

    /**
     * Classe interna (ou record) para mapear o 'ProdutoInput' do GraphQL.
     * Isso garante que a mutação receba apenas os campos necessários para a criação.
     */
    public record ProdutoInput(String nome, String descricao, BigDecimal preco, int estoque) {}
}