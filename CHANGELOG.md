# Changelog

## Unreleased

## 0.1.3 — Installation compatibility fix (pending npm publication)

- Fixed `ERESOLVE` on Tabby 1.0.235 when other installed plugins declare incompatible Angular peer dependencies (for example, `tabby-save-output@3.1.0` requires Angular 4).
- Removed *runtime peerDependencies* for Angular/Tabby host modules. These modules are provided by Tabby's own runtime; Angular 15 and Tabby API packages remain development-only dependencies for compilation.
- Added a package integration test using Tabby's npm Arborist installer with the legacy plugin already installed. Export/import features are unchanged.



- Open-source release preparation: MIT license, public documentation, security policy and contribution guidelines.
- npm package metadata and release checklists.

## 0.1.2 — Prepared, not yet published to npm

- Bump version for first public preview.
- Review Git history and document Angular 15 compatibility/security advisory boundaries.
- Add complete development audit visibility and npm name lookup to CI.

## 0.1.1 — Preview (2026-10-24)

- Fixed missing author metadata for Tabby plugin discovery.
- Added packaging, GitHub Actions and automated unit testing.
- First manual tests confirmed plugin load and SSH export.

## 0.1.0 — Development preview (2026-10-24)

- Standalone settings plugin for Tabby.
- Selective SSH export with folder hierarchy and explicit username opt-in.
- JSON sanitizer, append-only import and username prompt.
- Unit tests for secrets, format validation and ID remapping.
