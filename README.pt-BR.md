# Tabby Profile Share

**Compartilhe perfis SSH e a hierarquia de pastas do Tabby com segurança.**

[![CI](https://github.com/gugahartmann/Tabby_Profile_Share/actions/workflows/test.yml/badge.svg)](https://github.com/gugahartmann/Tabby_Profile_Share/actions/workflows/test.yml)
[![Licença MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[English](README.md)

O **Tabby Profile Share** é um plugin **independente, mantido pela comunidade**, compatível com o [Tabby do Eugeny](https://github.com/Eugeny/tabby). Não exige o fork Tabby Performance nem modifica o código original do Tabby.

> **Estado:** Preview 0.1.3 (ainda não publicada). A instalação manual e a exportação foram confirmadas em teste inicial. A compatibilidade entre versões e todos os fluxos de importação ainda precisam de testes adicionais. O pacote ainda não foi publicado no npm.

## Funcionalidades

- Exportar pastas, subpastas e perfis SSH individuais pela árvore com caixas de seleção.
- Listar usuários SSH distintos dos perfis selecionados. **Todos desmarcados por padrão**; você escolhe quais logins coletivos compartilhar.
- Preservar hierarquia, hostname/IP, porta SSH, algoritmos aceitos e outras opções expressamente permitidas.
- **Nunca exportar senhas, scripts de login, chaves privadas, caminhos de chaves e comandos proxy.**
- Importar como **novos grupos e novos perfis**, sem sobrescrever os dados existentes.
- Solicitar usuário SSH para os novos equipamentos sem login, mostrando até quatro exemplos e a quantidade restante.
- Preservar relações de jump host quando os dois perfis estiverem incluídos no mesmo pacote.

**Atenção à privacidade:** O JSON não contém credenciais armazenadas, mas **contém inventário de rede** (nomes, hosts, IPs internos e usuários expressamente selecionados). Compartilhe somente com destinatários autorizados e revise o arquivo antes de enviá-lo.

## Compatibilidade da instalação

A versão 0.1.3 remove as restrições de `peerDependencies` de execução para Angular e APIs do Tabby. Isso evita o erro `ERESOLVE` causado por plugins legados como `tabby-save-output@3.1.0` (Angular 4), pois o Tabby já oferece Angular e seus módulos internamente. As dependências de desenvolvimento continuam presentes para compilar e testar o código. Nenhuma configuração ou credencial SSH é alterada.

## Instalação

### Pelo próprio Tabby (após publicação no npm)

Abra **Settings → Plugins**, procure **profile-share** / `tabby-profile-share`, instale o pacote e reinicie, se solicitado.

O plugin ainda **não está publicado no npm**. Até lá, use o pacote compilado:

### Instalação manual — Windows

1. Acesse [GitHub Actions](https://github.com/gugahartmann/Tabby_Profile_Share/actions/workflows/test.yml), escolha uma execução aprovada e baixe o ZIP do plugin.
2. Extraia a pasta `tabby-profile-share` que está dentro do ZIP do pacote.
3. Feche completamente o Tabby, inclusive a bandeja.
4. Copie para:
   `%APPDATA%\tabby\plugins\node_modules\tabby-profile-share\`
5. Verifique `package.json` e `dist/index.js` nessa pasta e inicie o Tabby.
6. Abra a seção **Profile Sharing** em configurações.

Evite colocar a pasta diretamente em `plugins` ou aninhar duas pastas `tabby-profile-share`.

## Como utilizar

**Exportação:** marque as pastas e equipamentos que deseja compartilhar, selecione apenas os usuários SSH de equipe que devem acompanhar o arquivo e clique em **Export**.

**Importação:** faça backup das configurações, carregue o JSON, confira as quantidades e confirme. Novos grupos e perfis serão criados. Para perfis sem username, informe o usuário desejado ou prossiga sem preencher.

## Reportar bugs e sugerir melhorias

Acesse [Nova issue](https://github.com/gugahartmann/Tabby_Profile_Share/issues/new/choose) e escolha **Bug Report**, **Feature Request** ou **Custom / Question**. Os formulários seguem a estrutura objetiva das sugestões da comunidade [Tabby Better Sidebar](https://github.com/TooMuhtsh/tabby-better-sidebar/issues), acrescentando verificações de privacidade específicas para perfis SSH.

**Nunca anexe exports reais, endereços IP internos, nomes de equipamentos de produção, chaves, senhas ou logs sem anonimização.** Para falhas de segurança, siga [SECURITY.md](SECURITY.md).

## Publicação pelo GitHub Actions (sem Git ou Node.js local)

O mantenedor pode publicar usando somente o navegador: **GitHub → Actions → Stage npm package**. A primeira publicação exige um token npm temporário de **stage only** armazenado no Secret `NPM_STAGE_TOKEN`. As próximas versões usam Trusted Publishing (OIDC) sem token permanente. Cada versão passa por aprovação na interface do npm com 2FA.

Confira o [guia completo de publicação via GitHub Actions](docs/PUBLISHING.md). Nenhuma publicação é disparada automaticamente por commits ou PRs.

## Desenvolvimento

```bash
git clone https://github.com/gugahartmann/Tabby_Profile_Share.git
cd Tabby_Profile_Share
npm install --legacy-peer-deps
npm test
npm run build
npm pack --dry-run
```

O código-fonte é aberto. Veja [como contribuir](CONTRIBUTING.md), [política de segurança](SECURITY.md), [histórico](CHANGELOG.md) e [publicação no npm](docs/PUBLISHING.md).

**Nunca envie exports reais de rede, endereços de produção, credenciais, capturas sensíveis ou arquivos de configuração empresarial em issues ou pull requests.**

## Licença

[MIT](LICENSE) © 2026 gugahartmann e contribuidores. Projeto comunitário sem endosso ou vínculo oficial com a equipe de desenvolvimento do Tabby.
