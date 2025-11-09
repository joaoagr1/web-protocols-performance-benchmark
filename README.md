## ANÁLISE COMPARATIVA DE DESEMPENHO ENTRE PROTOCOLOS DE COMUNICAÇÃO WEB: REST, GRAPHQL E SOAP

Este repositório contém o código-fonte dos protótipos de serviço *web* desenvolvidos e os artefatos de relatório utilizados para a análise comparativa de desempenho no Trabalho de Conclusão de Curso (TCC) intitulado: *Análise Comparativa de Desempenho entre Protocolos de Comunicação Web: REST, GraphQL e SOAP*.

---

### 🎯 Objetivo do Projeto

O objetivo central deste trabalho foi realizar uma avaliação experimental e quantitativa do desempenho das arquiteturas **SOAP**, **REST** e **GraphQL**. A metodologia envolveu a implementação de um protótipo de serviço idêntico em três versões distintas para isolar e comparar o impacto de cada protocolo nas métricas críticas de performance e escalabilidade.

### 🧪 Metodologia Experimental

A análise foi conduzida através de testes de carga controlados, focados em cenários operacionais que exploram características inerentes a cada protocolo:

| Cenário | Foco da Análise | Métrica Chave |
| :--- | :--- | :--- |
| **Consultas Simples** | *Overhead* de Protocolo (Latência Base) | Latência Média |
| **Consultas Complexas** | Eficiência de Banda (*Over-fetching* vs. *Under-fetching*) | Taxa de Transferência (KB/s) |
| **Operações Transacionais** | Custo de Serialização/Desserialização (*Marshaling*) | Latência Média |
| **Teste de Estresse** | Limites de Escalabilidade | Vazão (*Throughput*) Máxima (Req/s) |

### 📂 Estrutura do Repositório

O repositório está organizado para facilitar a visualização dos protótipos e dos resultados da pesquisa:

* **`/src`**: Contém o código-fonte das três implementações do serviço *web* modelo.
    * `/http`: Serviço implementado seguindo o estilo arquitetural REST (JSON via HTTP).
    * `/graphql`: Serviço implementado utilizando o *runtime* GraphQL.
    * `/soap`: Serviço implementado utilizando o protocolo SOAP (XML).
* **`/reports`**: Contém os artefatos de dados brutos e sumarizados.


### ⚙️ Pré-requisitos para Execução

Para replicar o ambiente de testes, é necessário ter instalado:

1.  **Plataforma de Execução:** Java Development Kit (JDK) 21 e Spring Boot 3.5.6, que foram utilizados para o desenvolvimento back-end dos protótipos (SOAP, REST e GraphQL)
3.  **Ferramenta de Teste de Carga:** [Apache JMeter]

### 💡 Conclusão Principal

Os resultados demonstram que o **REST** é o modelo mais eficiente em **vazão (*throughput*)** e **baixa latência base**, sendo ideal para alta escalabilidade. O **GraphQL** é superior em **eficiência de banda**, oferecendo a melhor solução para aplicações com restrição de rede ou necessidade de dados aninhados. O **SOAP** apresentou severas restrições de desempenho e estabilidade, sendo o menos adequado para cenários de alta performance.

---

**Autor:** João Antônio Garcia Rolo
**Orientador:** Prof. Thiago Bussola da Silva
**Instituição:** Unicesumar
**Ano:** 2025
