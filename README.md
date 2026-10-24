# Tabby Profile Share

Plugin independente de **exportação e importação segura de profiles SSH** para o [Tabby oficial (Eugeny)](https://github.com/Eugeny/tabby).

> **Estado: preview 0.1.0 (código implementado; instalação e testes visuais no Tabby oficial pendentes).** Não publicado no npm. O código e a documentação vivem exclusivamente neste repositório.

## Objetivo

Permitir que equipes compartilhem centenas de conexões organizadas por pastas (por exemplo, Regional → Cidade → POP) sem compartilhar senhas, chaves privadas, scripts de login ou contas pessoais.

### Exportação

- Tela dedicada de configuração e prévia, com **árvore gráfica de grupos/subgrupos** semelhante à do Tabby e seleção por checkboxes.
- Seleção de pastas inteiras ou profiles individuais, preservando a hierarquia.
- Lista de **usuários SSH únicos**, com contador de equipamentos por usuário.
- **Todos os usuários desmarcados por padrão**; somente usernames explicitamente selecionados são copiados para o arquivo.
- Profiles associados a usernames não selecionados continuam no arquivo, mas **sem `options.user`**.
- **Nenhuma exportação de scripts de login**, senhas, credenciais do vault, conteúdo/caminhos de chaves privadas ou comandos que possam carregar segredos.
- Formato versionado e portátil, sugerido: `.tabby-profiles.json`.

### Importação

- Prévia da estrutura a importar e resumo de impacto.
- **Nunca sobrescrever profiles/grupos existentes**: cada importação cria novos IDs e novas entradas, mesmo quando já existe hostname ou nome semelhante.
- Remapear relações internas (pastas, jump hosts incluídos); evitar referências quebradas.
- Ao identificar profiles sem usuário SSH, mostrar **um modal visualmente alinhado ao prompt padrão do Tabby** pedindo um username, com até quatro nomes de equipamentos como exemplo e contagem dos demais.
- Aplicar o username informado somente aos **novos** profiles cujo username estiver vazio; preservar usernames explicitamente compartilhados.
- Permitir cancelar a importação ou continuar deixando esses usernames vazios.

## Compatibilidade

**Alvo primário:** versões suportadas do Tabby oficial [Eugeny/tabby](https://github.com/Eugeny/tabby), utilizando seus pontos de extensão públicos: `NgModule`, `SettingsTabProvider`, `ProfilesService` e `ConfigService`.

O Tabby Performance pode usar o mesmo plugin **como consumidor**, mas o plugin não dependerá de patches, APIs privadas ou funcionalidades exclusivas desse fork.

A preview utiliza os tipos do Tabby 1.0.231-nightly.0 (Angular 15). A instalação e a compatibilidade em versões estáveis do Tabby oficial **ainda não foram certificadas**.

## Especificação técnica

Leia [docs/SPEC.md](docs/SPEC.md) para fluxos, segurança, regras de importação e critérios de aceitação.

## Desenvolvimento e teste

Pré-requisitos: Node.js 22 e npm; a API alvo é o Tabby oficial, não o fork Tabby Performance.

```bash
npm install --legacy-peer-deps
npm test
npm run build
```

O comando de build gera `dist/index.js`. Para um **teste manual** no Tabby oficial, execute `npm pack` (o pacote contém `dist`) e instale o pacote através do mecanismo de plugins do Tabby, ou configure `TABBY_PLUGINS` apontando para a pasta deste projeto. Nas configurações aparecerá uma aba **Profile Sharing**.

**Verificações antes de compartilhar pacotes:** examine o JSON gerado em uma base fictícia; confirme que a árvore, usernames e algoritmos necessários estão preservados, que os dados sensíveis estão ausentes, e teste a importação em um perfil separado do Tabby. Dependências e instalação no aplicativo real ainda exigem validação. O plugin propositalmente não exporta referências a chaves privadas nem comandos de proxy; essas configurações deverão ser refeitas localmente.

[GitHub Actions](../../actions/workflows/test.yml) executa testes unitários do formato e um build de validação em cada push.

Consulte o [guia de desenvolvimento de plugins do Tabby](https://github.com/Eugeny/tabby/blob/master/HACKING.md).

## Segurança

A implementação usará uma **allowlist explícita** de campos exportáveis. Nunca serializar `config.store` nem defaults herdados sem revisão. Dados de autenticação não devem ser exportados; scripts de acesso e login estão **fora do escopo**, sem opção de habilitá-los.

## Licença

Licença de distribuição ainda não definida. O código não está publicado como pacote npm até que os testes de integração e a licença sejam revisados.
