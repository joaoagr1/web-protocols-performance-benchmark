package com.benchmark.soap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import br.com.seuprojeto.apisoap.generated.AdicionarProdutoRequest;
import br.com.seuprojeto.apisoap.generated.AdicionarProdutoResponse;
import br.com.seuprojeto.apisoap.generated.GetProdutoPorIdRequest;
import br.com.seuprojeto.apisoap.generated.GetProdutoPorIdResponse;
import br.com.seuprojeto.apisoap.generated.GetTodosProdutosRequest;
import br.com.seuprojeto.apisoap.generated.GetTodosProdutosResponse;
import br.com.seuprojeto.apisoap.generated.Produto;

@Endpoint
public class ProdutoEndpoint {

    private static final String NAMESPACE_URI = "http://www.seuprojeto.com.br/api-soap/produtos";

    private final ProdutoRepository produtoRepository;

    @Autowired
    public ProdutoEndpoint(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getProdutoPorIdRequest")
    @ResponsePayload
    public GetProdutoPorIdResponse getProdutoPorId(@RequestPayload GetProdutoPorIdRequest request) {
        GetProdutoPorIdResponse response = new GetProdutoPorIdResponse();
        response.setProduto(produtoRepository.findById(request.getId()));
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getTodosProdutosRequest")
    @ResponsePayload
    public GetTodosProdutosResponse getTodosProdutos(@RequestPayload GetTodosProdutosRequest request) {
        GetTodosProdutosResponse response = new GetTodosProdutosResponse();
        response.getProdutos().addAll(produtoRepository.findAll());
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "adicionarProdutoRequest")
    @ResponsePayload
    public AdicionarProdutoResponse adicionarProduto(@RequestPayload AdicionarProdutoRequest request) {
        Produto novoProduto = produtoRepository.save(
                request.getNome(),
                request.getDescricao(),
                request.getPreco(),
                request.getEstoque()
        );
        AdicionarProdutoResponse response = new AdicionarProdutoResponse();
        response.setProduto(novoProduto);
        return response;
    }
}