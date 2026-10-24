# Tabby Profile Share v0.1.4

**Independent community plugin for the official [Tabby terminal](https://github.com/Eugeny/tabby).** This release focuses on discoverability, documentation and safe demonstrations. **SSH export/import behavior is unchanged.**

## Highlights

- Better npm package description and precise discovery keywords for **SSH profile sharing**, profile export/import and Tabby Terminal.
- Updated [README](https://github.com/gugahartmann/Tabby_Profile_Share#readme) and [Portuguese README](https://github.com/gugahartmann/Tabby_Profile_Share/blob/main/README.pt-BR.md), with installation instructions, npm badges and feature overview.
- Corrected obsolete messages about the public npm package.
- Added `examples/demo-profiles.yaml`, a **safe, fictional Tabby configuration** with 16 SSH profiles, nested groups, non-routable examples and no credentials.
- Added a [screenshot guide](https://github.com/gugahartmann/Tabby_Profile_Share/blob/main/docs/SCREENSHOTS.md), plus tests guarding sample IDs, privacy and npm compatibility.
- Maintains the **0.1.3 fix** for plugin installation alongside legacy Angular 4 peer dependencies.

## Downloads

- **`tabby-profile-share-plugin-0.1.4.zip`** — manually installable plugin bundle for Tabby.
- **`tabby-profile-share-0.1.4.tgz`** — npm-format package archive.
- **`tabby-profile-share-demo-profiles.yaml`** — fake nested SSH profile dataset for product screenshots.

**Recommended installation:** Tabby → **Settings → Plugins → Available** → search `profile-share` → **Get**. The latest version available in the Tabby plugin manager depends on publication/approval of **v0.1.4** on npmjs.com. This GitHub release does **not** publish the npm version automatically.

## Security and compatibility

- The YAML is **fictional test data**. Use it only in an isolated Tabby configuration; do not overwrite your existing config.
- Exported SSH inventories may still contain sensitive hostnames, IP addresses and explicitly selected usernames. Never publish a real export.
- The plugin excludes credentials, private keys, key paths and login scripts from exported packages.
- Build and unit tests run in GitHub Actions; host installation compatibility was previously confirmed with official Tabby **1.0.235** on Windows.
- This is not an official release from the Tabby maintainers.

For complete changes see [CHANGELOG.md](https://github.com/gugahartmann/Tabby_Profile_Share/blob/main/CHANGELOG.md).
