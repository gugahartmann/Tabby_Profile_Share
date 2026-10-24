# Especificação funcional e técnica — Tabby Profile Share

**Repositório principal:** https://github.com/gugahartmann/Tabby_Profile_Share

**Compatibilidade obrigatória:** Tabby oficial https://github.com/Eugeny/tabby; não depender de modificações de Tabby_Performace.

## Objetivo
Criar o plugin independente `tabby-profile-sharing` para o Tabby oficial do Eugeny para compartilhar centenas de conexões SSH sem sobrescrever os profiles de quem importa, mantendo a hierarquia visual das pastas e permitindo compartilhar somente logins SSH explicitamente autorizados.

**Estado: especificação de requisitos, sem implementação ainda.**

## Exportação — interface e comportamento
- Abrir uma **tela/modal de configurações de exportação**, antes de gerar qualquer arquivo.
- Mostrar a **árvore gráfica de grupos e subgrupos** no estilo do gerenciador de profiles nativo (pastas expansíveis, checkbox em cada nó, seleção em cascata e estado parcial, contagem de dispositivos; perfis avulsos selecionáveis).
- Permitir selecionar pastas inteiras ou somente determinados equipamentos; exportar apenas os selecionados e seus grupos ancestrais, preservando estrutura e ordem.
- Mostrar lista **deduplicada de usuários SSH (`options.user`)**, com contagem de profiles para cada nome, por exemplo `operador — 128 equipamentos`.
- **Todos os usuários desmarcados por padrão**. Se um nome for marcado, mantê-lo nos profiles exportados correspondentes; se estiver desmarcado, exportar os profiles com `options.user` vazio/ausente. Nunca omitir o equipamento por causa do usuário.
- Atualizar a lista de usuários conforme a seleção de pastas/equipamentos; não confundir campos `user` com senhas.
- O arquivo exportado deve ter formato portátil, autocontido, versionado e legível (sugestão `.tabby-profiles.json`, com `formatVersion` e dados da árvore; sem identificadores de usuário pessoais desnecessários).

## Exclusões obrigatórias de segurança
- **Não exportar scripts de acesso/login nem oferecer opção para incluí-los.** Excluir `options.scripts` em profiles e qualquer default herdado.
- Não exportar **senhas**, `options.password`, vault, keytar, passphrases, **chaves privadas nem conteúdo/caminhos de chaves locais**.
- Trabalhar a partir de um **modelo allowlist** de campos exportáveis, não de `JSON.stringify(config.store)`. Sanitizar inclusive defaults de grupos e globais, valores herdados e opções extensíveis; campos desconhecidos ficam fora até serem auditados.
- Evitar exportar comandos de proxy que possam conter credenciais. Não acessar vault para fazer a exportação.
- Exibir prévia de quantidade de pastas, equipamentos, logins selecionados e alertas antes de salvar.

## Importação — nunca modificar itens existentes
- Ler e validar formato, versão, integridade e tamanho do arquivo, sem executar conteúdo.
- **Importar sempre como novos grupos e novos profiles**, mesmo quando nomes/hosts já existem. Não atualizar, substituir, renomear nem apagar grupos/profiles existentes.
- Preservar a árvore inteira de grupos/pastas usando remapeamento **novo ID de cada grupo e cada profile**, inclusive referências locais (p.ex. jump hosts exportados). Se um jump host não fizer parte do pacote, não manter referência quebrada: alertar e deixar indefinido.
- Apresentar preview da árvore importada e contagens antes da confirmação. Inserir novos itens após os existentes na visualização, respeitando a ordenação do gerenciador, sem depender de sobrescrever IDs.
- Aplicação com plano de importação preparado antes de persistir e tratamento de falhas para evitar conjunto parcialmente aplicado.

## Usuário SSH para profiles com login ausente
- Detectar profiles importados sem `options.user`.
- Antes de confirmar a importação, abrir **modal no padrão visual do Tabby** (semelhante ao prompt de senha), mas solicitando **username SSH**, não password.
- Exibir a quantidade total de equipamentos afetados e **até 4 exemplos** de equipamentos (nomes + host ou caminho da pasta), seguidos por “e outros N equipamentos”.
- Ex.: “42 equipamentos estão sem usuário SSH: SW-A, OLT-B, BNG-C, RT-D e outros 38. Qual usuário SSH deseja utilizar?”
- Preencher o login informado em **todos os novos profiles com usuário vazio**; preservar os usernames que foram explicitamente compartilhados no pacote.
- Oferecer opção explícita de continuar sem atribuir usuário (ou cancelar toda a importação), sem escrever credenciais ou alterá-las silenciosamente.

## Compatibilidade técnica
- Plugin Angular/TypeScript carregado pelo sistema de plugins do Tabby (`tabby-plugin` + `NgModule`), com tela própria via `SettingsTabProvider`, evitando patches no gerenciador nativo.
- Reutilizar `ProfilesService.getProfiles({includeBuiltin:false,clone:true})`, `getSyncProfileGroups()`, `newProfile()`, `newProfileGroup()`, `ConfigService.save()` e componentes de modal do Tabby conforme aplicável.
- Importação/exportação sob demanda; nenhuma assinatura que reconstrua repetidamente a árvore ou degradade a lista de milhares de equipamentos.
- Separar biblioteca de serialização/sanitização dos componentes de UI para testes unitários.

## Critérios de aceitação
- [ ] Base de ~380 equipamentos pode ser exportada por pastas sem travar a UI.
- [ ] Todos os usuários vêm desmarcados; marcar um nome altera apenas os seus profiles.
- [ ] Nenhuma senha, private key, script ou segredo aparece no JSON exportado, inclusive quando armazenado em defaults.
- [ ] Prévia de exportação representa fielmente a árvore e os contadores.
- [ ] Importar a mesma exportação duas vezes gera duas novas árvores, sem tocar nos dados pré-existentes.
- [ ] O modal de usuário apresenta quatro exemplos e a contagem restante, aplica apenas a profiles importados com username vazio.
- [ ] Autenticação SSH, algoritmos e estrutura são preservados nos campos explicitamente suportados, sem carregar secrets.
- [ ] Testes unitários de sanitização, remapeamento de IDs, nomes repetidos, referências e seleção parcial.
- [ ] Build `yarn run build` e testes de regressão documentados antes de publicar release.

## Notas
Os pontos de extensão e modelos a validar no Tabby oficial são: `tabby-core/src/services/profiles.service.ts`, `tabby-core/src/api/profileProvider.ts`, `tabby-ssh/src/profiles.ts`, `tabby-ssh/src/api/interfaces.ts` e `tabby-terminal/src/middleware/loginScriptProcessing.ts`. A implementação não deve usar `getConfigProxyForProfile` para serializar automaticamente defaults não auditados.

## Compatibilidade com o Tabby oficial
- Confirmar as assinaturas da versão suportada de `tabby-core`, `tabby-settings` e `tabby-ssh` antes de implementar.
- Usar exclusivamente pontos de extensão públicos; evitar imports de classes internas não exportadas e patches do Tabby Performance.
- Executar validação do plugin no Tabby oficial, instalação como plugin externo, build, testes de importação/exportação e regressão. Não declarar compatibilidade concluída sem esses testes.
