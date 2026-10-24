# Changelog

## Unreleased

## 0.1.4 — Documentation, discovery and GitHub release (2026-10-24)

- Improve npm package description and focused discovery keywords for SSH profile export/import.
- Refresh English and Brazilian Portuguese READMEs with public npm install instructions, badges and release links.
- Remove maintainer-only GitHub Actions publishing instructions from both READMEs (the publishing guide remains under `docs/`).
- Add a fully synthetic Tabby YAML config with nested groups and 16 fake SSH profiles for screenshots, plus a privacy-focused capture guide.
- No changes to the plugin's SSH import/export behavior or runtime dependencies.

## 0.1.3 — Installation compatibility fix (2026-10-24)

- Fixed npm `ERESOLVE` on Tabby 1.0.235 when other installed plugins declare incompatible Angular peer dependencies, such as `tabby-save-output@3.1.0`.
- Removed runtime `peerDependencies` for Angular and Tabby host modules; development dependencies remain for compilation.
- Added an integration test using Tabby's npm Arborist installer with the legacy plugin already installed.
- First successful installation via the official Tabby plugin manager was confirmed by an early tester.

## 0.1.2 — First npm public preview (2026-10-24)

- Published initial public npm version with MIT license and documentation.
- Reviewed Git history and documented Angular 15 compatibility/security advisory boundaries.
- Added build audit visibility and npm lookup in CI.

## 0.1.1 — Preview (2026-10-24)

- Fixed missing author metadata for Tabby plugin discovery.
- Added packaging, GitHub Actions and automated unit testing.
- First manual tests confirmed plugin load and SSH export.

## 0.1.0 — Development preview (2026-10-24)

- Standalone settings plugin for official Tabby.
- Selective SSH export with folder hierarchy and explicit username opt-in.
- Allowlist-based JSON sanitizer, append-only import and username prompt.
- Unit tests for secret exclusions, format validation and ID remapping.
