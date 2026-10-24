# Safe demo screenshots / Capturas de tela sem dados reais

The [demo-profiles.yaml](../examples/demo-profiles.yaml) file contains a **complete minimal Tabby YAML configuration**, grounded in Tabby's official `profiles` and `groups` format. It provides:

- **16 invented SSH profiles** and **10 nested groups** (including the root).
- North and South regions, backbone/core and access/OLT folders, plus demo data centers.
- Three invented logins (`netops`, `noc-demo`, `readonly`) and **three profiles with no username** (for demonstrating the optional username prompt).
- Only [RFC 5737 TEST-NET documentation IPs](https://datatracker.ietf.org/doc/html/rfc5737) (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`) and non-resolving `.invalid` hostnames (RFC 2606).
- **No passwords, real SSH keys, scripts, proxy commands, real hostnames or actual network infrastructure.**

**Do not attempt to connect to these devices.** They do not exist.

## Setup / Preparação

1. Prefer a **clean, disposable Tabby installation** in a separate Windows account or test VM. Do **not** point it at your everyday Tabby profile.
2. Close Tabby completely (including the system tray icon). Keep an offline backup of any original `config.yaml`; configuration files may contain sensitive information. **Never commit or upload that backup.**
3. For a **fresh, empty, disposable** Tabby profile, use the contents of `examples/demo-profiles.yaml` as its `config.yaml`. On Windows, Tabby usually stores its configuration under `%APPDATA%\tabby\config.yaml`. Verify the directory in your installed version.
4. If the disposable profile already has groups/profiles, **merge the example `groups` and `profiles` arrays** rather than pasting duplicate top-level keys. Profile IDs must be unique in that test profile.
5. Launch Tabby. Confirm the demo folder tree appears under **Profiles**, then open **Settings → Profile Sharing**. The YAML uses `showProfileTree: true` for visibility.
6. Once screenshots are complete, discard the disposable profile. Keep your production configuration untouched.

### Screenshots to capture / Capturas sugeridas

| Screenshot | Screen | Show |
| --- | --- | --- |
| `profile-tree.png` | Tabby profiles sidebar | `Demo Network` expanded into North Region, South Region and Demo Data Centers |
| `export-select.png` | Profile Sharing → Export | Nested folder selection, partially selected folder, device counts |
| `export-usernames.png` | Profile Sharing → Export | Username opt-in list; demonstrate that accounts are **unchecked by default** |
| `import-preview.png` | Profile Sharing → Import | First export **only** the fictional demo profiles; then use that JSON as import input in the isolated instance |
| `import-user-prompt.png` | Profile Sharing → Import | Demonstrate the prompt for the profiles whose demo username is blank, if shown by the installed version |

Suggested framing: use consistent window dimensions, crop excess desktop, hide personal account details, and retain the actual Tabby UI (do not create simulated screenshots). Capture enough context to see where the plugin lives inside Tabby.

**Do not publish a screenshot until you have checked every visible hostname, username, IP, window title and terminal.** Use fictional sample data only. Avoid showing actual SSH sessions.

## Approved screenshot set (2026-10-24)

The four screenshots were captured with **fictional** network profiles and reviewed for obvious sensitive information. The same images are referenced by the English and Portuguese READMEs. The original image files are distributed for maintainers as `tabby-profile-share-screenshots.zip`, with these exact filenames:

- `docs/screenshots/export-overview.png`: folder/device selection and SSH username opt-in
- `docs/screenshots/import-overview.png`: JSON import preview with four example profiles
- `docs/screenshots/import-username-prompt.png`: optional username entry for two demo devices
- `docs/screenshots/exported-json-example.png`: generated JSON structure and safe fields

All user-uploaded samples use documentation-only hostnames and/or reserved documentation IP address blocks. The files are authentic screenshots, not mockups.

If GitHub image upload is required, **extract the ZIP first** and upload the four PNGs together into `docs/screenshots/` on the `docs/add-product-screenshots` branch. Preserve the exact names. Do not upload an actual Tabby configuration or any other real-world host inventory.

**Maintainers:** keep the screenshot changes in a PR until all four binary PNGs are in Git. Merge only after the README image links resolve. After merging, the release notes update workflow updates the existing v0.1.4 GitHub Release description without republishing any npm package.

## PT-BR — observações importantes

O YAML é **um exemplo de configuração para uma instalação isolada**, não um arquivo para importar diretamente pela aba **Import** do Profile Share. O importador do plugin utiliza o JSON próprio `.tabby-profiles.json`, criado pelo botão **Export**.

O arquivo `examples/demo-profiles.yaml` deve ser usado em uma instalação de teste do Tabby, substituindo apenas o `config.yaml` descartável dessa instalação. Nunca sobrescreva seu perfil de uso diário. Depois da exportação fictícia, você pode importar o JSON gerado no mesmo ambiente de teste para capturar a prévia.
