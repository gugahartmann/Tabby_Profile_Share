# Dependency and publication security review — 2026-10-24

Status: reviewed for the planned 0.1.2 public preview. This is a risk assessment, **not** a claim that every dependency or runtime is vulnerability-free.

## Git history and code

- Reviewed the 36 commits present at the initial review of main, the source tree, and the 2 repository issues/PRs for private network address patterns, obvious secrets, keys and emails.
- No real internal IPv4 hosts or obvious leaked credentials were identified by the pattern checks. Most occurrences of password/secret terms were in security guidance or synthetic regression tests.
- All commit author email addresses observed used GitHub `noreply` addresses.
- **Limits:** Pattern matching cannot prove the entire history is free of sensitive data. The repository owner should still review the final visibility preview and avoid uploading real exports/screenshots/issues containing internal IPs.

## npm audit

GitHub Actions build for 0.1.2 ran:

- `npm audit --omit=dev --audit-level=high`: **0 reported vulnerabilities**.
- Full `npm audit --json`: 6 advisory records (2 high, 4 moderate) under the dependency graph, principally Angular 15 compatibility dependencies.

The 2 high alerts are for development-time dependencies **`@angular/core` and `@angular/common`** used for building and type-checking against Tabby's Angular 15 APIs. Other moderate advisory entries arise through Angular and Tabby dev dependency relationships. Their details are available in the versioned GitHub Actions build logs.

Angular, ng-bootstrap, and `tabby-core` are marked **external** in the Webpack bundle, so the npm tarball contains the plugin code but **does not ship its own copy of those Angular packages**. In use, the plugin relies on the host Tabby runtime. This distinction is important: a vulnerability in the **host Angular runtime** may still affect users independently of what is bundled in the plugin.

Upgrading the plugin's Angular development version to 22 simply to silence the advisories would not make an Angular 15-based Tabby installation run Angular 22, and could break plugin compatibility. The correct remediation requires upstream-compatible Tabby/Angular version support and regression tests. Until then, keep this risk visible, do not claim all vulnerabilities are fixed, and avoid untrusted HTML interpolation.

## Import/export boundaries

- Export is allowlist-based, not a copy of raw Tabby configuration.
- Credential material, password fields, private key paths, login scripts and proxy commands are excluded.
- Exports **still contain network inventory**: device names, addresses, hierarchy and opted-in SSH usernames. Do not publish real exports to GitHub.
- Import performs format validation and ID remapping before append-only persistence. This protects existing IDs under normal operation but is not a substitute for backups or full integration testing.

## Remaining release checks

- Confirm a clean installation against a supported official Tabby stable version.
- Re-test SSH import, including blank users, shared users and duplicate import.
- Re-evaluate audit results for future supported Tabby/Angular major versions.
- Check npm package name/ownership before publishing.
- Do not publish a package without a valid MIT license in the tarball.
