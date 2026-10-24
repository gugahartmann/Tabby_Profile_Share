# Tabby Profile Share

**Compartilhe perfis SSH do Tabby, não suas credenciais.**

**Compartilhe perfis SSH e a hierarquia de pastas do Tabby com segurança.**

[![CI](https://github.com/gugahartmann/Tabby_Profile_Share/actions/workflows/test.yml/badge.svg)](https://github.com/gugahartmann/Tabby_Profile_Share/actions/workflows/test.yml)
[![Licença MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Versão npm](https://img.shields.io/npm/v/tabby-profile-share.svg)](https://www.npmjs.com/package/tabby-profile-share)
[![Downloads npm](https://img.shields.io/npm/dm/tabby-profile-share.svg)](https://www.npmjs.com/package/tabby-profile-share)

[English](README.md)

O **Tabby Profile Share** é um plugin **independente, mantido pela comunidade**, compatível com o [Tabby do Eugeny](https://github.com/Eugeny/tabby). Não exige o fork Tabby Performance nem modifica o código original do Tabby.

**Publicado no npm:** [tabby-profile-share](https://www.npmjs.com/package/tabby-profile-share) · [Releases no GitHub](https://github.com/gugahartmann/Tabby_Profile_Share/releases) · [Abrir issue](https://github.com/gugahartmann/Tabby_Profile_Share/issues/new/choose).

Instalação via gerenciador de plugins confirmada no Tabby oficial **1.0.235**, Windows. A compatibilidade com outras versões e cenários completos de importação continua em validação.

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

A partir da versão 0.1.3, o plugin remove as restrições de `peerDependencies` de execução para Angular e APIs do Tabby. Isso evita o erro `ERESOLVE` causado por plugins legados como `tabby-save-output@3.1.0` (Angular 4), pois o Tabby já oferece Angular e seus módulos internamente. As dependências de desenvolvimento continuam presentes para compilar e testar o código. Nenhuma configuração ou credencial SSH é alterada.

## Instalação

No Tabby, abra **Settings → Plugins → Available**, pesquise **profile-share**, encontre `tabby-profile-share`, clique em **Get** e reinicie se solicitado. O plugin está no [npm](https://www.npmjs.com/package/tabby-profile-share), sem necessidade de instalar Git ou compilar manualmente. Por conta do ranking da busca, plugins recentes podem aparecer no final da lista. Depois, abra **Settings → Profile Sharing**.

Também oferecemos arquivos compilados em [Releases](https://github.com/gugahartmann/Tabby_Profile_Share/releases) para instalação manual.

### Instalação manual — Windows

1. Baixe o ZIP compilado em [GitHub Releases](https://github.com/gugahartmann/Tabby_Profile_Share/releases) ou em [GitHub Actions](https://github.com/gugahartmann/Tabby_Profile_Share/actions/workflows/test.yml).
2. Extraia a pasta `tabby-profile-share` que está dentro do ZIP do pacote.
3. Feche completamente o Tabby, inclusive a bandeja.
4. Copie para:
   `%APPDATA%\tabby\plugins\node_modules\tabby-profile-share\`
5. Verifique `package.json` e `dist/index.js` nessa pasta e inicie o Tabby.
6. Abra a seção **Profile Sharing** em configurações.

Evite colocar a pasta diretamente em `plugins` ou aninhar duas pastas `tabby-profile-share`.

## Capturas de tela

Estas imagens foram capturadas no **Tabby com [perfis SSH demonstrativos e fictícios](examples/demo-profiles.yaml)**, sem infraestrutura real, senhas ou chaves privadas.

### 1. Seleção de pastas, equipamentos e usuários compartilhados

Escolha quais pastas e equipamentos serão exportados. O compartilhamento de usernames é **opcional e desmarcado por padrão**. Neste exemplo, apenas o usuário `noc-demo` foi selecionado.

![Tela de exportação do Tabby Profile Share com pastas SSH, equipamentos e seleção de usuários compartilhados](https://raw.githubusercontent.com/gugahartmann/Tabby_Profile_Share/main/docs/screenshots/export-overview.png)

### 2. Prévia dos dados a importar

Carregue um arquivo `.tabby-profiles.json` e confira a quantidade de novas pastas, perfis SSH e equipamentos sem username. Os itens importados são novos e não substituem os já cadastrados.

![Prévia da importação com duas novas pastas, quatro perfis e dois equipamentos sem username](https://raw.githubusercontent.com/gugahartmann/Tabby_Profile_Share/main/docs/screenshots/import-overview.png)

### 3. Preenchimento de usernames ausentes

Quando os perfis importados estão sem usuário SSH, o plugin solicita um username, exibindo exemplos dos equipamentos afetados. É possível continuar sem preencher.

![Solicitação de username SSH para dois equipamentos demonstrativos durante a importação](https://raw.githubusercontent.com/gugahartmann/Tabby_Profile_Share/main/docs/screenshots/import-username-prompt.png)

### 4. Estrutura do JSON exportado

O arquivo inclui `groups` e `profiles` com versão de formato e opções SSH sanitizadas. Senhas, chaves privadas e scripts de login ficam de fora.

![Exemplo de JSON exportado com estrutura de grupos e perfis SSH fictícios](https://raw.githubusercontent.com/gugahartmann/Tabby_Profile_Share/main/docs/screenshots/exported-json-example.png)

## Como utilizar

**Exportação:** marque as pastas e equipamentos que deseja compartilhar, selecione apenas os usuários SSH de equipe que devem acompanhar o arquivo e clique em **Export**.

**Importação:** faça backup das configurações, carregue o JSON, confira as quantidades e confirme. Novos grupos e perfis serão criados. Para perfis sem username, informe o usuário desejado ou prossiga sem preencher.

## Reportar bugs e sugerir melhorias

Acesse [Nova issue](https://github.com/gugahartmann/Tabby_Profile_Share/issues/new/choose) e escolha **Bug Report**, **Feature Request** ou **Custom / Question**. Os formulários seguem a estrutura objetiva das sugestões da comunidade [Tabby Better Sidebar](https://github.com/TooMuhtsh/tabby-better-sidebar/issues), acrescentando verificações de privacidade específicas para perfis SSH.

**Nunca anexe exports reais, endereços IP internos, nomes de equipamentos de produção, chaves, senhas ou logs sem anonimização.** Para falhas de segurança, siga [SECURITY.md](SECURITY.md).

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
