# Tabby Profile Share

Plugin independente de **exportação e importação segura de profiles SSH** para o [Tabby oficial (Eugeny)](https://github.com/Eugeny/tabby).

> **Estado: planejamento / especificação.** O plugin ainda não está implementado ou pronto para instalação. Este repositório passa a ser a única base de desenvolvimento e documentação do projeto.

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

A estratégia de versão mínima de Tabby será definida e testada na implementação; nenhuma compatibilidade binária foi certificada até o momento.

## Especificação técnica

Leia [docs/SPEC.md](docs/SPEC.md) para fluxos, segurança, regras de importação e critérios de aceitação.

## Desenvolvimento (planejado)

1. Criar projeto independente TypeScript/Angular com palavra-chave `tabby-plugin` no `package.json`.
2. Implementar lógica de exportação/importação e sanitização, isolada da interface.
3. Integrar a UI por meio do `SettingsTabProvider`.
4. Testar no Tabby oficial e com ~380 profiles; publicar o pacote somente após validação.

Consulte o [guia de desenvolvimento de plugins do Tabby](https://github.com/Eugeny/tabby/blob/master/HACKING.md).

## Segurança

A implementação usará uma **allowlist explícita** de campos exportáveis. Nunca serializar `config.store` nem defaults herdados sem revisão. Dados de autenticação não devem ser exportados; scripts de acesso e login estão **fora do escopo**, sem opção de habilitá-los.

## Licença

Ainda não definida. Nenhuma licença é concedida implicitamente por este documento.
