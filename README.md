# Vitrine — Catálogo Interativo de Produtos

## Integrantes
- [Adicionar nome dos integrantes]

## Descrição
Aplicação web de catálogo de produtos que consome a API pública DummyJSON. Permite listar, pesquisar, filtrar por categoria, visualizar detalhes e favoritar produtos.

## Tecnologias
- HTML5
- CSS3
- JavaScript (Fetch API, async/await, DOM e localStorage)
- DummyJSON Products API
- Frankfurter API para cotação USD/BRL

## Como executar
1. Extraia os arquivos.
2. Abra a pasta no Visual Studio Code.
3. Execute `index.html` com a extensão Live Server (recomendado) ou abra diretamente no navegador.
4. É necessária conexão com a internet para consultar as APIs.

## Conversão de preços
Os preços recebidos da DummyJSON estão em dólares americanos (USD). O projeto consulta a cotação USD/BRL na API Frankfurter e converte os valores para reais (R$). Caso a cotação não esteja disponível, utiliza uma taxa provisória de R$ 5,50 por dólar, definida no arquivo `script.js`.

## Idioma
A interface, as categorias e os nomes traduzidos mais comuns são apresentados em português. A API pode fornecer nomes e descrições em inglês; para esses casos, o código aplica traduções cadastradas e descrições resumidas em português por categoria. Alguns nomes menos comuns podem permanecer no idioma original.

## Funcionalidades
- Listagem de produtos com imagem e preço em reais.
- Pesquisa por nome.
- Filtro por categoria em português.
- Modal com detalhes do produto.
- Adicionar e remover favoritos.
- Persistência dos favoritos com localStorage.
- Mensagens de carregamento e tratamento de falhas de rede.

## Arquivos
- `index.html`: estrutura da aplicação.
- `style.css`: estilos e responsividade.
- `script.js`: consumo das APIs e funcionalidades.
