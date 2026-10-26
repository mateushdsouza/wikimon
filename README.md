# Wikimon

Projeto acadêmico de uma enciclopédia Pokémon, desenvolvido em HTML, CSS e JavaScript com dados da [PokéAPI](https://pokeapi.co/).

## Funcionalidades presentes no código

- Busca por início do nome, com até 20 resultados na página de pesquisa.
- Listagem e páginas de detalhes dos Pokémon.
- Comparação de atributos entre dois Pokémon.
- Favoritos associados ao usuário da demonstração local.
- Telas de cadastro e login com armazenamento no navegador.

## Como executar

```sh
git clone https://github.com/mateushdsouza/wikimon.git
cd wikimon
```

Sirva **a raiz do repositório** com um servidor estático, como a extensão Live Server do VS Code. Abra `/homepage/index.html` no endereço local fornecido. Não há `index.html` na raiz. Algumas rotas começam com `/`, portanto hospedar diretamente em um subdiretório exige ajustar esses caminhos.

É necessário acesso à internet para consultar a PokéAPI e carregar recursos externos.

## Organização

- [homepage/](homepage/): página inicial.
- [listapage/](listapage/): catálogo.
- [searchpage/](searchpage/): pesquisa.
- [detailPage/](detailPage/): ficha do Pokémon.
- [compPage/](compPage/): comparação.
- [favorito/](favorito/): favoritos.
- [loginpage/](loginpage/) e [registerpage/](registerpage/): demonstração de conta local.

## Limitações

O login **não é autenticação segura de produção**. Usuários e senhas ficam em texto no localStorage; use apenas dados fictícios e nunca senhas reais. Não há servidor de autenticação ou sincronização entre dispositivos. Limpar os dados do navegador apaga as contas e os favoritos locais.

A pesquisa atual filtra nomes; não deve ser apresentada como busca completa por tipo ou número. Consultas dependem da disponibilidade da PokéAPI. A revisão da documentação não equivale a uma validação completa de todos os fluxos da aplicação.

## Aprendizado e créditos

Consumo de API com Fetch, manipulação do DOM, operações assíncronas, comparação de dados e persistência local para fins didáticos.

[Protótipo no Figma](https://www.figma.com/design/iKTkCZqIRtZ497VtETy3nv/wikimon?node-id=0-1). Pokémon e suas imagens pertencem aos respectivos titulares. A autoria das contribuições permanece registrada no histórico do repositório.
